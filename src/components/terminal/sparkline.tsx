import { sparkFromChanges } from "@/lib/solana/format";
import type { PricePath } from "@/lib/solana/types";

export function Sparkline({
  price,
  changes,
  className = "h-8 w-24",
}: {
  price: number;
  changes: PricePath;
  className?: string;
}) {
  const pts = sparkFromChanges(price, changes);
  if (pts.length < 2) return <div className={className} />;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const w = 96;
  const h = 32;
  const d = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((p - min) / span) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const up = pts[pts.length - 1] >= pts[0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke={up ? "var(--color-up)" : "var(--color-down)"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VolumeBars({ volumes }: { volumes: PricePath }) {
  const vals = [volumes.m5, volumes.m15, volumes.m30, volumes.h1, volumes.h6, volumes.h24];
  const max = Math.max(...vals, 1);
  return (
    <div className="flex h-6 items-end gap-0.5" aria-hidden="true">
      {vals.map((v, i) => (
        <span
          key={i}
          className="w-1 rounded-sm bg-accent/70"
          style={{ height: `${Math.max(12, (v / max) * 100)}%`, opacity: 0.35 + (i / 6) * 0.65 }}
        />
      ))}
    </div>
  );
}
