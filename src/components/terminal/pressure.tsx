import { cn } from "@/lib/cn";

export function PressureBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className={cn("flex min-w-16 items-center gap-2", className)}>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-down/30">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-up"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="num w-8 text-right font-mono text-[10px] text-muted">{pct}%</span>
    </div>
  );
}
