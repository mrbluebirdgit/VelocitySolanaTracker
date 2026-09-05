export type Heat = "hot" | "warm" | "cool" | "dead";

export type WindowStats = {
  volume: number;
  buys: number;
  sells: number;
  buyers: number;
  sellers: number;
  change: number;
};

export type PricePath = {
  m5: number;
  m15: number;
  m30: number;
  h1: number;
  h6: number;
  h24: number;
};

export type TokenSnap = {
  mint: string;
  pool: string;
  name: string;
  symbol: string;
  image: string | null;
  dex: string;
  dexId: string;
  quote: string;
  priceUsd: number;
  fdv: number | null;
  mcap: number | null;
  liquidity: number | null;
  createdAt: string;
  ageMs: number;
  w5m: WindowStats;
  w1h: WindowStats;
  w24h: WindowStats;
  changes: PricePath;
  volumes: PricePath;
  score: number;
  heat: Heat;
  pressure: number;
  boost: number;
  source: "trending" | "new" | "boosted" | "search" | "watch";
  url: string | null;
  websites: string[];
  socials: { platform: string; url: string }[];
};

export type MarketPayload = {
  tokens: TokenSnap[];
  solPrice: number | null;
  fetchedAt: number;
  tape: { mint: string; symbol: string; name: string; ageMs: number }[];
  stats: {
    fresh: number;
    hot: number;
    vol5m: number;
  };
};

export type ChartPoint = {
  t: number;
  p: number;
  v: number;
};

export type TabId = "pulse" | "new" | "boosted" | "watch";
