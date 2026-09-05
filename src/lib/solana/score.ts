import type { Heat, TokenSnap, WindowStats } from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function pressureOf(w: WindowStats): number {
  const total = w.buys + w.sells;
  if (total <= 0) return 0.5;
  return w.buys / total;
}

export function scoreToken(t: Omit<TokenSnap, "score" | "heat" | "pressure">): Pick<TokenSnap, "score" | "heat" | "pressure"> {
  const vol5 = Math.max(0, t.w5m.volume);
  const vol1h = Math.max(0, t.w1h.volume);
  const expected = Math.max(vol1h / 12, 1);
  const accel = clamp(vol5 / expected, 0, 10);
  const tx = t.w5m.buys + t.w5m.sells;
  const unique = t.w5m.buyers + t.w5m.sellers;
  const liq = t.liquidity ?? 0;
  const liqScore = liq < 400 ? 0 : clamp(Math.log10(liq) / 6, 0, 1);
  const press = pressureOf(t.w5m);
  const ch5 = t.changes.m5;
  const dump = ch5 < -55 ? 0.35 : ch5 < -30 ? 0.65 : 1;
  const ageMin = t.ageMs / 60_000;
  const recency = ageMin < 8 ? 1.25 : ageMin < 45 ? 1.1 : ageMin < 180 ? 1 : 0.9;
  const boost = t.boost > 0 ? 1.08 : 1;

  const raw =
    Math.log10(vol5 + 8) * 16 +
    Math.min(tx, 220) * 0.12 +
    Math.min(unique, 140) * 0.22 +
    accel * 7 +
    press * 14 +
    Math.min(Math.max(ch5, 0), 60) * 0.1 +
    liqScore * 18 +
    (t.boost > 0 ? 4 : 0);

  const score = Math.round(clamp(raw * recency * dump * boost, 0, 99));
  const heat: Heat =
    score >= 72 && press >= 0.45 && vol5 >= 800
      ? "hot"
      : score >= 52
        ? "warm"
        : score >= 28
          ? "cool"
          : "dead";

  return { score, heat, pressure: press };
}
