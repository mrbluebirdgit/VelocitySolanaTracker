import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Bell,
  Filter,
  Radio,
  Search,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getMarket, getWatchTokens, searchMarket } from "@/lib/solana/api";
import { fmtAge, fmtCompact, fmtPct, fmtUsd } from "@/lib/solana/format";
import type { MarketPayload, TabId, TokenSnap } from "@/lib/solana/types";
import { useWatchlist } from "@/lib/watchlist";
import { TokenAvatar } from "./avatar";
import { PressureBar } from "./pressure";
import { Sparkline, VolumeBars } from "./sparkline";
import { TokenPanel } from "./token-panel";

const TABS: { id: TabId; label: string }[] = [
  { id: "pulse", label: "Pulse" },
  { id: "new", label: "New" },
  { id: "boosted", label: "Boosted" },
  { id: "watch", label: "Watch" },
];

type Filters = {
  minLiq: number;
  minVol: number;
  maxAgeH: number;
};

const FILTERS: { id: string; label: string; value: Filters }[] = [
  { id: "raw", label: "Raw", value: { minLiq: 0, minVol: 0, maxAgeH: 0 } },
  { id: "flow", label: "Flow", value: { minLiq: 1000, minVol: 500, maxAgeH: 0 } },
  { id: "desk", label: "Desk", value: { minLiq: 8000, minVol: 2000, maxAgeH: 24 } },
];

export function Terminal({ initial }: { initial?: MarketPayload | null }) {
  const [tab, setTab] = useState<TabId>("pulse");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filterId, setFilterId] = useState("raw");
  const [selected, setSelected] = useState<TokenSnap | null>(null);
  const [clock, setClock] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const seenAlerts = useRef(new Set<string>());

  const watchItems = useWatchlist((s) => s.items);
  const pushAlert = useWatchlist((s) => s.pushAlert);
  const alerts = useWatchlist((s) => s.alerts);
  const watched = useWatchlist((s) => s.has);
  const toggle = useWatchlist((s) => s.toggle);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 280);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setHydrated(true);
    const tick = () => setClock(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSelected(null);
        searchRef.current?.blur();
      }
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "1") setTab("pulse");
      if (e.key === "2") setTab("new");
      if (e.key === "3") setTab("boosted");
      if (e.key === "4") setTab("watch");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const market = useQuery({
    queryKey: ["market", tab === "watch" ? "pulse" : tab],
    queryFn: () =>
      getMarket({ data: { feed: tab === "watch" ? "pulse" : (tab as "pulse" | "new" | "boosted") } }),
    refetchInterval: 10_000,
    enabled: tab !== "watch" && debounced.length < 2,
    initialData: tab === "pulse" && debounced.length < 2 ? (initial ?? undefined) : undefined,
    placeholderData: (prev) => prev,
  });

  const watchQuery = useQuery({
    queryKey: ["watch", watchItems.map((i) => i.mint).join(",")],
    queryFn: () => getWatchTokens({ data: { mints: watchItems.map((i) => i.mint) } }),
    refetchInterval: 8_000,
    enabled: tab === "watch" && watchItems.length > 0 && debounced.length < 2,
  });

  const searchQuery = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchMarket({ data: { q: debounced } }),
    enabled: debounced.length >= 2,
  });

  const payload = market.data;
  const filters = FILTERS.find((f) => f.id === filterId)?.value ?? FILTERS[1].value;

  const rows = useMemo(() => {
    if (debounced.length >= 2) return searchQuery.data ?? [];
    const base = tab === "watch" ? (watchQuery.data ?? []) : (payload?.tokens ?? []);
    return base.filter((t) => {
      if (filters.minLiq && (t.liquidity ?? 0) < filters.minLiq) return false;
      if (filters.minVol && t.w5m.volume < filters.minVol) return false;
      if (filters.maxAgeH && t.ageMs > filters.maxAgeH * 3600_000) return false;
      return true;
    });
  }, [debounced, searchQuery.data, tab, watchQuery.data, payload, filters]);

  useEffect(() => {
    if (!payload) return;
    for (const t of payload.tokens) {
      if (!watched(t.mint)) continue;
      if (t.changes.m5 >= 18 && t.w5m.volume >= 800) {
        const key = `spike-${t.mint}-${Math.floor(Date.now() / 45_000)}`;
        if (seenAlerts.current.has(key)) continue;
        seenAlerts.current.add(key);
        pushAlert({
          mint: t.mint,
          symbol: t.symbol,
          kind: "spike",
          message: `${t.symbol} +${t.changes.m5.toFixed(1)}% / 5m · ${fmtUsd(t.w5m.volume)} flow`,
        });
        toast(`${t.symbol} traffic spike`, { description: `${fmtPct(t.changes.m5)} on 5-minute volume` });
      } else if (t.changes.m5 <= -35 && t.w5m.volume >= 800) {
        const key = `dump-${t.mint}-${Math.floor(Date.now() / 45_000)}`;
        if (seenAlerts.current.has(key)) continue;
        seenAlerts.current.add(key);
        pushAlert({
          mint: t.mint,
          symbol: t.symbol,
          kind: "dump",
          message: `${t.symbol} ${t.changes.m5.toFixed(1)}% / 5m`,
        });
      }
    }
  }, [payload, pushAlert, watched]);

  const loading =
    debounced.length >= 2
      ? searchQuery.isLoading
      : tab === "watch"
        ? watchQuery.isLoading
        : market.isLoading && !payload;

  const error =
    debounced.length >= 2
      ? searchQuery.error
      : tab === "watch"
        ? watchQuery.error
        : market.error;

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <header className="shrink-0 border-b border-border px-3 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-accent-fg">
              <Zap className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Solana radar</p>
              <h1 className="text-base font-semibold tracking-tight">VELOCITY</h1>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 font-mono text-[11px] text-muted">
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="pulse-dot size-1.5 rounded-full bg-up" />
              Live
            </span>
            <span className="num hidden md:inline">
              SOL {payload?.solPrice ? fmtUsd(payload.solPrice, 2) : "—"}
            </span>
            <span className="num hidden lg:inline">
              {payload ? `${payload.stats.fresh} fresh` : ""}
            </span>
            <span className="num min-w-16 text-right" suppressHydrationWarning>
              {clock || "—"}
            </span>
          </div>
        </div>

        {payload?.tape && payload.tape.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-[var(--radius-sm)] bg-surface py-1.5 shadow-[var(--shadow-border)]">
            <div className="tape-track flex w-max gap-6 px-4 font-mono text-[11px] text-muted">
              {[...payload.tape, ...payload.tape].map((t, i) => (
                <button
                  key={`${t.mint}-${i}`}
                  type="button"
                  className="shrink-0 hover:text-fg"
                  onClick={() => {
                    setQuery(t.mint);
                    setTab("pulse");
                  }}
                >
                  <span className="text-accent">{t.symbol}</span>
                  <span className="mx-1.5 text-subtle">·</span>
                  {fmtAge(t.ageMs)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mint, ticker — /"
              className="pl-9 font-mono"
              aria-label="Search tokens"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {FILTERS.map((f) => (
              <Button
                key={f.id}
                variant={filterId === f.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterId(f.id)}
              >
                {f.id === "desk" ? <Filter className="size-3.5" /> : null}
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-2 sm:px-4">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative h-11 shrink-0 px-3 text-sm transition-colors duration-150 ${
                  tab === t.id ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {t.id === "pulse" && <Activity className="size-3.5" />}
                  {t.id === "new" && <Radio className="size-3.5" />}
                  {t.id === "boosted" && <Zap className="size-3.5" />}
                  {t.id === "watch" && <Star className="size-3.5" />}
                  {t.label}
                  {t.id === "watch" && watchItems.length > 0 && (
                    <span className="num rounded-full bg-elevated px-1.5 text-[10px]">{watchItems.length}</span>
                  )}
                </span>
                {tab === t.id && (
                  <span className="absolute inset-x-3 bottom-0 h-px bg-accent" />
                )}
                <span className="sr-only">Shortcut {i + 1}</span>
              </button>
            ))}
            {alerts.length > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 pr-2 font-mono text-[11px] text-accent">
                <Bell className="size-3" />
                {alerts.length}
              </span>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : error ? (
              <Empty
                title="Feed stalled"
                body="The indexer didn't answer. Retrying on the next tick."
              />
            ) : tab === "watch" && watchItems.length === 0 && debounced.length < 2 ? (
              <Empty
                title="Watchlist is empty"
                body="Star a mint from Pulse. When 5-minute volume spikes, Velocity flags it here."
              />
            ) : rows.length === 0 ? (
              <Empty
                title="No prints in this filter"
                body="Drop to Raw, or wait a few seconds — Solana is still minting."
              />
            ) : (
              <>
                <div className="hidden md:grid md:grid-cols-[minmax(0,1.6fr)_64px_88px_72px_88px_88px_72px_88px_56px] md:gap-2 md:px-4 md:py-2 md:text-[10px] md:uppercase md:tracking-wider md:text-subtle">
                  <span>Token</span>
                  <span>Age</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">5m</span>
                  <span className="text-right">Vol 5m</span>
                  <span>Pressure</span>
                  <span>Liq</span>
                  <span>Path</span>
                  <span className="text-right">Score</span>
                </div>
                <ul>
                  {rows.map((t) => (
                    <li key={t.mint}>
                      <TokenRow
                        token={t}
                        active={selected?.mint === t.mint}
                        watched={hydrated && watched(t.mint)}
                        onOpen={() => setSelected(t)}
                        onWatch={() => toggle({ mint: t.mint, symbol: t.symbol, name: t.name })}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        {selected && (
          <div className="hidden w-[380px] shrink-0 border-l border-border lg:block">
            <TokenPanel token={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>

      {selected && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-bg/70" onClick={() => setSelected(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[86dvh] overflow-auto rounded-t-[var(--radius-xl)] shadow-[var(--shadow-border)]">
            <TokenPanel token={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

function TokenRow({
  token,
  active,
  watched,
  onOpen,
  onWatch,
}: {
  token: TokenSnap;
  active: boolean;
  watched: boolean;
  onOpen: () => void;
  onWatch: () => void;
}) {
  const up = token.changes.m5 >= 0;
  return (
    <div
      className={`grid cursor-pointer items-center gap-2 border-b border-border px-3 py-3 transition-colors duration-150 sm:px-4 md:grid-cols-[minmax(0,1.6fr)_64px_88px_72px_88px_88px_72px_88px_56px] ${
        active ? "bg-elevated" : "hover:bg-surface"
      }`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex min-w-0 items-center gap-3">
        <TokenAvatar mint={token.mint} symbol={token.symbol} image={token.image} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{token.symbol}</span>
            {token.heat === "hot" && <Badge tone="hot">Hot</Badge>}
            {token.boost > 0 && <Badge tone="warn">Boost</Badge>}
            {token.source === "new" && token.ageMs < 180_000 && <Badge tone="accent">New</Badge>}
          </div>
          <p className="truncate text-xs text-muted">
            {token.name} · {token.dex}
          </p>
        </div>
        <button
          type="button"
          className="ml-auto flex size-10 items-center justify-center text-muted hover:text-accent md:hidden"
          aria-label={watched ? "Unwatch" : "Watch"}
          onClick={(e) => {
            e.stopPropagation();
            onWatch();
          }}
        >
          <Star className={`size-4 ${watched ? "fill-accent text-accent" : ""}`} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 md:mt-0 md:contents">
        <Cell label="Age" value={fmtAge(token.ageMs)} />
        <Cell label="Price" value={fmtUsd(token.priceUsd)} />
        <Cell label="5m" value={fmtPct(token.changes.m5)} tone={up ? "up" : "down"} />
        <div className="hidden md:block">
          <p className="num text-right font-mono text-xs">{fmtUsd(token.w5m.volume || token.w24h.volume)}</p>
        </div>
        <div className="col-span-3 md:col-span-1">
          <p className="mb-1 text-[10px] uppercase tracking-wider text-subtle md:hidden">Pressure</p>
          <PressureBar value={token.pressure} />
        </div>
        <div className="hidden md:block">
          <p className="num font-mono text-xs text-muted">{fmtUsd(token.liquidity)}</p>
        </div>
        <div className="hidden md:flex md:items-center md:gap-2">
          <Sparkline price={token.priceUsd} changes={token.changes} className="h-7 w-16" />
          <VolumeBars volumes={token.volumes} />
        </div>
        <div className="hidden text-right md:block">
          <span className="num font-mono text-sm font-medium text-accent">{token.score}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between md:hidden">
        <span className="text-xs text-muted">
          {fmtUsd(token.w5m.volume || token.w24h.volume)} vol · {fmtCompact(token.w5m.buys + token.w5m.sells)} tx
        </span>
        <span className="num font-mono text-sm text-accent">{token.score}</span>
      </div>
    </div>
  );
}

function Cell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-subtle md:hidden">{label}</p>
      <p
        className={`num font-mono text-xs md:text-right ${
          tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <p className="text-base font-medium">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
