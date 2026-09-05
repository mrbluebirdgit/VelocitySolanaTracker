import { useState } from "react";
import { cn } from "@/lib/cn";

function hue(mint: string): number {
  let h = 0;
  for (let i = 0; i < mint.length; i++) h = (h * 31 + mint.charCodeAt(i)) % 360;
  return h;
}

export function TokenAvatar({
  mint,
  symbol,
  image,
  size = "md",
}: {
  mint: string;
  symbol: string;
  image: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const dim = size === "lg" ? "size-12" : size === "sm" ? "size-7" : "size-9";
  const letters = (symbol.replace(/[^A-Za-z0-9]/g, "") || "?").slice(0, 2).toUpperCase();
  const showImg = image && !failed;
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-elevated",
        dim,
      )}
      style={
        showImg
          ? undefined
          : { background: `hsl(${hue(mint)} 18% 18%)` }
      }
    >
      {showImg ? (
        <img
          src={image}
          alt=""
          className="size-full object-cover"
          crossOrigin="anonymous"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex size-full items-center justify-center font-mono text-[10px] font-medium text-fg/80">
          {letters}
        </span>
      )}
    </div>
  );
}
