function trimFixed(n: number, digits: number): string {
  const s = n.toFixed(digits);
  return s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function compact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${trimFixed(abs / 1_000_000_000, 1)}B`;
  if (abs >= 1_000_000) return `${sign}${trimFixed(abs / 1_000_000, 1)}M`;
  if (abs >= 1_000) return `${sign}${trimFixed(abs / 1_000, 1)}K`;
  return `${sign}${trimFixed(abs, abs >= 100 ? 0 : 1)}`;
}

export function stripEmoji(value: string): string {
  return value.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s+/g, " ").trim();
}

export function shortMint(mint: string, head = 4, tail = 4): string {
  if (mint.length <= head + tail + 1) return mint;
  return `${mint.slice(0, head)}…${mint.slice(-tail)}`;
}

export function fmtUsd(n: number | null | undefined, digits = 2): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs === 0) return "$0";
  if (abs >= 1000) return `${sign}$${compact(abs)}`;
  if (abs >= 1) return `${sign}$${abs.toFixed(digits)}`;
  if (abs >= 0.01) return `${sign}$${abs.toFixed(4)}`;
  return `${sign}$${abs.toPrecision(3)}`;
}

export function fmtCompact(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1000) return Math.round(n).toString();
  return compact(n);
}

export function fmtPct(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  const abs = Math.abs(n);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtAge(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function dexLabel(id: string): string {
  const map: Record<string, string> = {
    "pump-fun": "Pump",
    pumpswap: "PumpSwap",
    pumpfun: "Pump",
    raydium: "Raydium",
    "raydium-clmm": "Raydium",
    "raydium-cpmm": "Raydium",
    orca: "Orca",
    "meteora-dbc": "Meteora",
    "meteora-damm-v2": "Meteora",
    meteora: "Meteora",
    moonshot: "Moonshot",
    jupiter: "Jupiter",
    phoenix: "Phoenix",
  };
  return map[id] ?? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function sparkFromChanges(price: number, changes: { m5: number; m15: number; m30: number; h1: number; h6: number; h24: number }): number[] {
  if (!Number.isFinite(price) || price <= 0) return [];
  const back = (pct: number) => price / (1 + pct / 100);
  return [
    back(changes.h24),
    back(changes.h6),
    back(changes.h1),
    back(changes.m30),
    back(changes.m15),
    back(changes.m5),
    price,
  ].map((v) => (Number.isFinite(v) && v > 0 ? v : price));
}
