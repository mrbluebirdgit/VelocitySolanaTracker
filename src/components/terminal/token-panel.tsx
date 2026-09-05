import { useQuery } from "@tanstack/react-query";
import {
  Copy,
  ExternalLink,
  Star,
  X,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPoolChart } from "@/lib/solana/api";
import { fmtAge, fmtPct, fmtUsd, shortMint, sparkFromChanges } from "@/lib/solana/format";
import type { TokenSnap } from "@/lib/solana/types";
import { useWatchlist } from "@/lib/watchlist";
import { TokenAvatar } from "./avatar";
import { PressureBar } from "./pressure";
import { Sparkline } from "./sparkline";

function copy(text: string, label: string) {
  void navigator.clipboard.writeText(text);
  toast.success(`Copied ${label}`);
}

const LINKS = (mint: string) =>
  [
    { label: "DexScreener", href: `https://dexscreener.com/solana/${mint}` },
    { label: "Jupiter", href: `https://jup.ag/swap/SOL-${mint}` },
    { label: "Photon", href: `https://photon-sol.tinyastro.io/en/lp/${mint}` },
    { label: "GMGN", href: `https://gmgn.ai/sol/token/${mint}` },
  ] as const;

export function TokenPanel({ token, onClose }: { token: TokenSnap; onClose: () => void }) {
  const watched = useWatchlist((s) => s.has(token.mint));
  const toggle = useWatchlist((s) => s.toggle);
  const chart = useQuery({
    queryKey: ["chart", token.pool],
    queryFn: () => getPoolChart({ data: { pool: token.pool } }),
    staleTime: 20_000,
  });

  const fallback = sparkFromChanges(token.priceUsd, token.changes).map((p, i) => ({
    t: i,
    p,
    v: 0,
  }));
  const data = (chart.data && chart.data.length > 2 ? chart.data : fallback).map((d) => ({
    ...d,
    label: "t" in d && d.t > 10_000 ? new Date(d.t).toLocaleTimeString() : "",
  }));
  const up = token.changes.m5 >= 0;

  return (
    <aside className="flex h-full flex-col bg-surface shadow-[var(--shadow-border)]">
      <header className="flex items-start gap-3 p-4 pb-3">
        <TokenAvatar mint={token.mint} symbol={token.symbol} image={token.image} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-medium tracking-tight">{token.symbol}</h2>
            <Badge tone={token.heat === "hot" ? "hot" : token.heat === "warm" ? "accent" : "mute"}>
              {token.heat}
            </Badge>
          </div>
          <p className="truncate text-sm text-muted">{token.name}</p>
          <button
            type="button"
            onClick={() => copy(token.mint, "mint")}
            className="mt-1 flex items-center gap-1 font-mono text-[11px] text-subtle hover:text-fg"
          >
            {shortMint(token.mint, 6, 6)}
            <Copy className="size-3" />
          </button>
        </div>
        <div className="flex gap-1">
          <Button
            variant={watched ? "default" : "outline"}
            size="icon-sm"
            aria-label={watched ? "Remove from watchlist" : "Watch"}
            onClick={() => toggle({ mint: token.mint, symbol: token.symbol, name: token.name })}
          >
            <Star className={watched ? "fill-current" : ""} />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
            <X />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2 px-4">
        <Stat label="Price" value={fmtUsd(token.priceUsd)} tone={up ? "up" : "down"} />
        <Stat label="5m" value={fmtPct(token.changes.m5)} tone={up ? "up" : "down"} />
        <Stat label="Score" value={String(token.score)} />
        <Stat label="Liq" value={fmtUsd(token.liquidity)} />
        <Stat label="FDV" value={fmtUsd(token.fdv)} />
        <Stat label="Age" value={fmtAge(token.ageMs)} />
      </div>

      <div className="mt-4 h-36 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="px" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                background: "var(--color-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [fmtUsd(v), "Price"]}
              labelFormatter={() => ""}
            />
            <Area
              type="monotone"
              dataKey="p"
              stroke="var(--color-accent)"
              fill="url(#px)"
              strokeWidth={1.6}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-3 px-4">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-subtle">Buy pressure 5m</p>
          <PressureBar value={token.pressure} />
          <p className="mt-1 font-mono text-[11px] text-muted">
            {token.w5m.buys} buys / {token.w5m.sells} sells · {token.w5m.buyers} buyers
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Mini k="Vol 5m" v={fmtUsd(token.w5m.volume)} />
          <Mini k="Vol 1h" v={fmtUsd(token.w1h.volume)} />
          <Mini k="Vol 24h" v={fmtUsd(token.w24h.volume)} />
          <Mini k="Tx 5m" v={String(token.w5m.buys + token.w5m.sells)} />
          <Mini k="1h" v={fmtPct(token.changes.h1)} />
          <Mini k="24h" v={fmtPct(token.changes.h24)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-subtle">{token.dex}</span>
          <Sparkline price={token.priceUsd} changes={token.changes} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 px-4">
        {LINKS(token.mint).map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-elevated text-xs font-medium text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
          >
            {l.label}
            <ExternalLink className="size-3 text-muted" />
          </a>
        ))}
      </div>

      {(token.socials.length > 0 || token.websites.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 px-4">
          {token.websites.map((u) => (
            <a key={u} href={u} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
              Site
            </a>
          ))}
          {token.socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-accent hover:underline"
            >
              {s.platform}
            </a>
          ))}
        </div>
      )}

      <p className="mt-auto p-4 text-[11px] leading-relaxed text-subtle">
        Traffic score weights 5-minute volume acceleration, unique takers, buy pressure, and
        liquidity. Not financial advice — Solana prints faster than this screen.
      </p>
    </aside>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-elevated px-2 py-2">
      <p className="text-[10px] uppercase tracking-wider text-subtle">{label}</p>
      <p
        className={`num mt-0.5 font-mono text-sm font-medium ${
          tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[var(--radius-xs)] bg-bg px-2 py-2">
      <p className="text-[10px] uppercase tracking-wider text-subtle">{k}</p>
      <p className="num mt-0.5 font-mono text-xs">{v}</p>
    </div>
  );
}
