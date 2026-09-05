import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "@/components/terminal/terminal";
import { getMarket } from "@/lib/solana/api";
import type { MarketPayload } from "@/lib/solana/types";

export const Route = createFileRoute("/")({
  loader: async (): Promise<MarketPayload | null> => {
    try {
      return await getMarket({ data: { feed: "pulse" } });
    } catch {
      return null;
    }
  },
  staleTime: 15_000,
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  return <Terminal initial={initial} />;
}
