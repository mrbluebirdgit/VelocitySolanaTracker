import { dexLabel, stripEmoji } from "./format";
import { scoreToken } from "./score";
import type { MarketPayload, PricePath, TokenSnap, WindowStats } from "./types";

const PAP = "https://api.dexpaprika.com";
const DEX = "https://api.dexscreener.com";
const SOL_MINT = "So11111111111111111111111111111111111111112";
const STABLES = new Set([
  SOL_MINT,
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
]);

type CacheEntry<T> = { at: number; value: T };
const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

async function cached<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && Date.now() - hit.at < ttl) return hit.value;
  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;
  const p = fn()
    .then((value) => {
      cache.set(key, { at: Date.now(), value });
      inflight.delete(key);
      return value;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });
  inflight.set(key, p);
  return p;
}

function num(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function numOrNull(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "VelocityRadar/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type PapWindow = {
  volume_usd?: number;
  buys?: number;
  sells?: number;
  txns?: number;
  last_price_usd_change?: number;
};

type PapToken = {
  id?: string;
  name?: string;
  symbol?: string;
  chain?: string;
  has_image?: boolean;
  website?: string;
  price_usd?: number;
  fdv?: number | null;
  summary?: {
    price_usd?: number;
    fdv?: number | null;
    liquidity_usd?: number | null;
    "5m"?: PapWindow;
    "15m"?: PapWindow;
    "30m"?: PapWindow;
    "1h"?: PapWindow;
    "6h"?: PapWindow;
    "24h"?: PapWindow;
  };
};

type PapPool = {
  id?: string;
  dex_id?: string;
  dex_name?: string;
  price_usd?: number;
  volume_usd_24h?: number;
  transactions_24h?: number;
  liquidity_usd?: number;
  created_at?: string;
  price_change_percentage_5m?: number;
  price_change_percentage_1h?: number;
  price_change_percentage_6h?: number;
  price_change_percentage_24h?: number;
  tokens?: { id?: string; chain?: string; has_image?: boolean }[];
};

type DexPair = {
  chainId?: string;
  dexId?: string;
  pairAddress?: string;
  url?: string;
  pairCreatedAt?: number;
  priceUsd?: string;
  fdv?: number;
  marketCap?: number;
  liquidity?: { usd?: number };
  volume?: Record<string, number>;
  priceChange?: Record<string, number>;
  txns?: Record<string, { buys?: number; sells?: number }>;
  baseToken?: { address?: string; name?: string; symbol?: string };
  quoteToken?: { address?: string; name?: string; symbol?: string };
  info?: {
    imageUrl?: string;
    websites?: { url?: string }[];
    socials?: { platform?: string; handle?: string; url?: string }[];
  };
  boosts?: { active?: number };
};

function winFrom(w: PapWindow | undefined, change: number): WindowStats {
  return {
    volume: num(w?.volume_usd),
    buys: num(w?.buys),
    sells: num(w?.sells),
    buyers: num(w?.buys),
    sellers: num(w?.sells),
    change,
  };
}

function memeMint(tokens: { id?: string }[] | undefined): string {
  const ids = (tokens ?? []).map((t) => t.id).filter((id): id is string => Boolean(id));
  return ids.find((id) => !STABLES.has(id)) || ids.find((id) => id !== SOL_MINT) || "";
}

function finalize(partial: Omit<TokenSnap, "score" | "heat" | "pressure">): TokenSnap {
  return { ...partial, ...scoreToken(partial) };
}

function fromPaprika(pool: PapPool, token: PapToken | null, source: TokenSnap["source"]): TokenSnap | null {
  const mint = token?.id || memeMint(pool.tokens);
  if (!mint || STABLES.has(mint)) return null;
  const sum = token?.summary;
  const symbol = stripEmoji(token?.symbol || mint.slice(0, 4).toUpperCase());
  const name = stripEmoji(token?.name || token?.symbol || mint.slice(0, 6));
  const price = num(sum?.price_usd) || num(token?.price_usd) || num(pool.price_usd);
  if (/^(w?sol|usdc|usdt)$/i.test(symbol) && (price > 0.5 || mint === SOL_MINT)) return null;
  const createdAt = pool.created_at || new Date().toISOString();
  const ageMs = Math.max(0, Date.now() - Date.parse(createdAt));
  const changes: PricePath = {
    m5: num(pool.price_change_percentage_5m ?? sum?.["5m"]?.last_price_usd_change),
    m15: num(sum?.["15m"]?.last_price_usd_change),
    m30: num(sum?.["30m"]?.last_price_usd_change),
    h1: num(pool.price_change_percentage_1h ?? sum?.["1h"]?.last_price_usd_change),
    h6: num(pool.price_change_percentage_6h ?? sum?.["6h"]?.last_price_usd_change),
    h24: num(pool.price_change_percentage_24h ?? sum?.["24h"]?.last_price_usd_change),
  };
  const w5m = winFrom(sum?.["5m"], changes.m5);
  const w1h = winFrom(sum?.["1h"], changes.h1);
  const w24h = winFrom(sum?.["24h"], changes.h24);
  if (w24h.volume <= 0) w24h.volume = num(pool.volume_usd_24h);
  if (w5m.volume <= 0 && w24h.volume > 0) {
    w5m.volume = w24h.volume * Math.min(Math.abs(changes.m5) / 100, 0.2);
  }
  if (w24h.buys + w24h.sells <= 0) {
    w24h.buys = Math.round(num(pool.transactions_24h) / 2);
    w24h.sells = num(pool.transactions_24h) - w24h.buys;
  }
  const dexId = pool.dex_id || "unknown";
  return finalize({
    mint,
    pool: pool.id || mint,
    name,
    symbol,
    image: null,
    dex: pool.dex_name || dexLabel(dexId),
    dexId,
    quote: "SOL",
    priceUsd: price,
    fdv: numOrNull(sum?.fdv ?? token?.fdv),
    mcap: numOrNull(sum?.fdv ?? token?.fdv),
    liquidity: numOrNull(sum?.liquidity_usd ?? pool.liquidity_usd),
    createdAt,
    ageMs,
    w5m,
    w1h,
    w24h,
    changes,
    volumes: {
      m5: w5m.volume,
      m15: num(sum?.["15m"]?.volume_usd),
      m30: num(sum?.["30m"]?.volume_usd),
      h1: w1h.volume,
      h6: num(sum?.["6h"]?.volume_usd),
      h24: w24h.volume,
    },
    boost: 0,
    source,
    url: `https://dexscreener.com/solana/${mint}`,
    websites: token?.website ? [token.website] : [],
    socials: [],
  });
}

function fromDex(pair: DexPair, source: TokenSnap["source"], boost = 0): TokenSnap | null {
  if (pair.chainId && pair.chainId !== "solana") return null;
  const mint = pair.baseToken?.address;
  if (!mint || STABLES.has(mint)) return null;
  const createdAt = pair.pairCreatedAt
    ? new Date(pair.pairCreatedAt).toISOString()
    : new Date().toISOString();
  const ageMs = Math.max(0, Date.now() - (pair.pairCreatedAt ?? Date.now()));
  const dexId = pair.dexId ?? "unknown";
  const tx = (key: string): WindowStats => ({
    volume: num(pair.volume?.[key]),
    buys: num(pair.txns?.[key]?.buys),
    sells: num(pair.txns?.[key]?.sells),
    buyers: num(pair.txns?.[key]?.buys),
    sellers: num(pair.txns?.[key]?.sells),
    change: num(pair.priceChange?.[key]),
  });
  const socials =
    pair.info?.socials
      ?.map((s) => {
        const platform = s.platform || "link";
        const url = s.url || (s.handle ? `https://x.com/${s.handle.replace(/^@/, "")}` : "");
        return url ? { platform, url } : null;
      })
      .filter((s): s is { platform: string; url: string } => Boolean(s)) ?? [];
  const websites = (pair.info?.websites ?? []).map((w) => w.url).filter((u): u is string => Boolean(u));
  return finalize({
    mint,
    pool: pair.pairAddress || mint,
    name: stripEmoji(pair.baseToken?.name || pair.baseToken?.symbol || "Unknown"),
    symbol: stripEmoji(pair.baseToken?.symbol || "???"),
    image: pair.info?.imageUrl || null,
    dex: dexLabel(dexId),
    dexId,
    quote: pair.quoteToken?.symbol || "SOL",
    priceUsd: num(pair.priceUsd),
    fdv: numOrNull(pair.fdv),
    mcap: numOrNull(pair.marketCap),
    liquidity: numOrNull(pair.liquidity?.usd),
    createdAt,
    ageMs,
    w5m: tx("m5"),
    w1h: tx("h1"),
    w24h: tx("h24"),
    changes: {
      m5: num(pair.priceChange?.m5),
      m15: num(pair.priceChange?.m15),
      m30: num(pair.priceChange?.m30),
      h1: num(pair.priceChange?.h1),
      h6: num(pair.priceChange?.h6),
      h24: num(pair.priceChange?.h24),
    },
    volumes: {
      m5: num(pair.volume?.m5),
      m15: num(pair.volume?.m15),
      m30: num(pair.volume?.m30),
      h1: num(pair.volume?.h1),
      h6: num(pair.volume?.h6),
      h24: num(pair.volume?.h24),
    },
    boost: boost || num(pair.boosts?.active),
    source,
    url: pair.url || `https://dexscreener.com/solana/${pair.pairAddress ?? mint}`,
    websites,
    socials,
  });
}

function mergePrefer(a: TokenSnap, b: TokenSnap): TokenSnap {
  const pick = b.w5m.volume > a.w5m.volume ? b : a;
  return {
    ...pick,
    image: a.image || b.image,
    boost: Math.max(a.boost, b.boost),
    name: a.name.length > 4 ? a.name : b.name,
    symbol: a.symbol.length >= 2 && a.symbol !== a.mint.slice(0, 4).toUpperCase() ? a.symbol : b.symbol,
    websites: a.websites.length ? a.websites : b.websites,
    socials: a.socials.length ? a.socials : b.socials,
    url: a.url || b.url,
    w5m: a.w5m.volume >= b.w5m.volume ? a.w5m : b.w5m,
  };
}

function dedupe(rows: TokenSnap[]): TokenSnap[] {
  const map = new Map<string, TokenSnap>();
  for (const row of rows) {
    const prev = map.get(row.mint);
    map.set(row.mint, prev ? mergePrefer(prev, row) : row);
  }
  return [...map.values()];
}

async function papSearch(orderBy: string, limit = 20): Promise<PapPool[]> {
  const json = (await getJson(
    `${PAP}/networks/solana/pools/search?order=desc&order_by=${orderBy}&limit=${limit}`,
  )) as { results?: PapPool[] } | null;
  return json?.results ?? [];
}

async function papToken(mint: string): Promise<PapToken | null> {
  return cached(`pap-t:${mint}`, 25_000, async () => {
    const json = (await getJson(`${PAP}/networks/solana/tokens/${encodeURIComponent(mint)}`)) as PapToken | null;
    return json && json.id ? json : null;
  });
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return out;
}

async function hydratePools(pools: PapPool[], source: TokenSnap["source"]): Promise<TokenSnap[]> {
  const mints = [...new Set(pools.map((p) => memeMint(p.tokens)).filter(Boolean))].slice(0, 10);
  const tokens = await mapLimit(mints, 6, papToken);
  const byMint = new Map<string, PapToken>();
  for (const t of tokens) if (t?.id) byMint.set(t.id, t);
  const rows: TokenSnap[] = [];
  for (const pool of pools) {
    const mint = memeMint(pool.tokens);
    const row = fromPaprika(pool, (mint && byMint.get(mint)) || null, source);
    if (row) rows.push(row);
  }
  return dedupe(rows);
}

async function solPrice(): Promise<number | null> {
  const t = await papToken(SOL_MINT);
  const px = num(t?.summary?.price_usd ?? t?.price_usd);
  return px > 0 ? px : null;
}

async function dexBoosts(): Promise<TokenSnap[]> {
  return cached("dex-boosts", 20_000, async () => {
    const [latest, top] = await Promise.all([
      getJson(`${DEX}/token-boosts/latest/v1`),
      getJson(`${DEX}/token-boosts/top/v1`),
    ]);
    const list = [...(Array.isArray(latest) ? latest : []), ...(Array.isArray(top) ? top : [])] as {
      chainId?: string;
      tokenAddress?: string;
      amount?: number;
      totalAmount?: number;
      icon?: string;
    }[];
    const boostMap = new Map<string, { amount: number; icon?: string }>();
    for (const b of list.filter((x) => x.chainId === "solana" && x.tokenAddress)) {
      const mint = b.tokenAddress!;
      const amount = num(b.totalAmount ?? b.amount);
      const prev = boostMap.get(mint);
      if (!prev || amount > prev.amount) boostMap.set(mint, { amount, icon: b.icon });
    }
    const mints = [...boostMap.keys()].slice(0, 24);
    if (mints.length === 0) return [];
    const rows = (
      await mapLimit(mints, 6, async (mint) => {
        const token = await papToken(mint);
        if (!token) return null;
        const row = fromPaprika(
          {
            id: mint,
            dex_name: "Boosted",
            price_usd: num(token.summary?.price_usd ?? token.price_usd),
            liquidity_usd: num(token.summary?.liquidity_usd),
            created_at: new Date().toISOString(),
            tokens: [{ id: mint }],
          },
          token,
          "boosted",
        );
        if (row) {
          row.boost = boostMap.get(mint)?.amount ?? 0;
          const icon = boostMap.get(mint)?.icon;
          if (icon && icon.startsWith("http")) row.image = icon;
        }
        return row;
      })
    ).filter((x): x is TokenSnap => Boolean(x));
    return dedupe(rows).sort((a, b) => b.boost - a.boost || b.score - a.score);
  });
}

export async function loadFeed(feed: "pulse" | "new" | "boosted"): Promise<MarketPayload> {
  const [sol, volume, fresh, movers, boosted] = await Promise.all([
    cached("sol", 20_000, solPrice),
    cached("pap-vol", 12_000, () => papSearch("volume_usd_24h", 12)),
    cached("pap-new", 8_000, () => papSearch("created_at", 14)),
    cached("pap-m5", 10_000, () => papSearch("price_change_percentage_5m", 12)),
    feed === "boosted" ? dexBoosts() : Promise.resolve([] as TokenSnap[]),
  ]);

  const unique = [...new Set([...volume, ...fresh, ...movers].map((p) => memeMint(p.tokens)).filter(Boolean))].slice(
    0,
    14,
  );
  await mapLimit(unique, 8, papToken);

  const [volRows, newRows, moveRows] = await Promise.all([
    hydratePools(volume, "trending"),
    hydratePools(fresh, "new"),
    hydratePools(movers, "trending"),
  ]);

  const tape = newRows
    .slice()
    .sort((a, b) => a.ageMs - b.ageMs)
    .slice(0, 14)
    .map((t) => ({ mint: t.mint, symbol: t.symbol, name: t.name, ageMs: t.ageMs }));

  let tokens: TokenSnap[] = [];
  if (feed === "new") tokens = newRows.sort((a, b) => a.ageMs - b.ageMs);
  else if (feed === "boosted") {
    tokens = boosted.length ? boosted : moveRows.sort((a, b) => b.changes.m5 - a.changes.m5);
  } else {
    tokens = dedupe([...moveRows, ...volRows, ...newRows]).sort((a, b) => b.score - a.score);
  }

  const stats = {
    fresh: newRows.filter((t) => t.ageMs < 5 * 60_000).length,
    hot: tokens.filter((t) => t.heat === "hot").length,
    vol5m: tokens.reduce((s, t) => s + t.w5m.volume, 0),
  };

  return { tokens, solPrice: sol, fetchedAt: Date.now(), tape, stats };
}

export async function searchFeed(q: string): Promise<TokenSnap[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  return cached(`search:${query.toLowerCase()}`, 15_000, async () => {
    const [pap, dex] = await Promise.all([
      getJson(`${PAP}/search?query=${encodeURIComponent(query)}`),
      getJson(`${DEX}/latest/dex/search?q=${encodeURIComponent(query)}`),
    ]);
    const papTokens = ((pap as { tokens?: PapToken[] } | null)?.tokens ?? []).filter((t) => t.chain === "solana");
    const fromPap = (
      await mapLimit(papTokens.slice(0, 12), 5, async (t) => {
        const full = t.id ? await papToken(t.id) : t;
        return fromPaprika(
          {
            id: t.id,
            dex_name: "Search",
            price_usd: num(t.price_usd),
            tokens: [{ id: t.id }],
          },
          full,
          "search",
        );
      })
    ).filter((x): x is TokenSnap => Boolean(x));
    const fromD = ((dex as { pairs?: DexPair[] } | null)?.pairs ?? [])
      .map((p) => fromDex(p, "search"))
      .filter((x): x is TokenSnap => Boolean(x));
    return dedupe([...fromPap, ...fromD])
      .sort((a, b) => b.w5m.volume - a.w5m.volume || b.score - a.score)
      .slice(0, 40);
  });
}

export async function loadMints(mints: string[]): Promise<TokenSnap[]> {
  const unique = [...new Set(mints.map((m) => m.trim()).filter(Boolean))].slice(0, 20);
  if (unique.length === 0) return [];
  const rows = (
    await mapLimit(unique, 5, async (mint) => {
      const token = await papToken(mint);
      if (!token) return null;
      return fromPaprika({ id: mint, dex_name: "Watch", tokens: [{ id: mint }] }, token, "watch");
    })
  ).filter((x): x is TokenSnap => Boolean(x));
  return dedupe(rows).sort((a, b) => b.score - a.score);
}

export async function loadChart(pool: string): Promise<{ t: number; p: number; v: number }[]> {
  const json = (await getJson(
    `https://api.geckoterminal.com/api/v2/networks/solana/pools/${encodeURIComponent(pool)}/ohlcv/minute?aggregate=5&limit=48`,
  )) as { data?: { attributes?: { ohlcv_list?: (number | string)[][] } } } | null;
  const list = json?.data?.attributes?.ohlcv_list ?? [];
  return list
    .map((row) => ({
      t: num(row[0]) * (num(row[0]) < 10_000_000_000 ? 1000 : 1),
      p: num(row[4]),
      v: num(row[5]),
    }))
    .filter((r) => r.p > 0)
    .sort((a, b) => a.t - b.t);
}
