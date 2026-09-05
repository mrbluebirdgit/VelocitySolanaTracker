import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ChartPoint, MarketPayload, TokenSnap } from "./types";

const emptyMarket = (): MarketPayload => ({
  tokens: [],
  solPrice: null,
  fetchedAt: Date.now(),
  tape: [],
  stats: { fresh: 0, hot: 0, vol5m: 0 },
});

export const getMarket = createServerFn({ method: "GET" })
  .validator(z.object({ feed: z.enum(["pulse", "new", "boosted"]) }))
  .handler(async ({ data }): Promise<MarketPayload> => {
    try {
      const { loadFeed } = await import("./load.server");
      return await loadFeed(data.feed);
    } catch (err) {
      console.error("[velocity] loadFeed", err);
      return emptyMarket();
    }
  });

export const searchMarket = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().max(80) }))
  .handler(async ({ data }): Promise<TokenSnap[]> => {
    try {
      const { searchFeed } = await import("./load.server");
      return await searchFeed(data.q);
    } catch (err) {
      console.error("[velocity] search", err);
      return [];
    }
  });

export const getWatchTokens = createServerFn({ method: "POST" })
  .validator(z.object({ mints: z.array(z.string().max(64)).max(20) }))
  .handler(async ({ data }): Promise<TokenSnap[]> => {
    try {
      const { loadMints } = await import("./load.server");
      return await loadMints(data.mints);
    } catch (err) {
      console.error("[velocity] watch", err);
      return [];
    }
  });

export const getPoolChart = createServerFn({ method: "GET" })
  .validator(z.object({ pool: z.string().max(88) }))
  .handler(async ({ data }): Promise<ChartPoint[]> => {
    try {
      const { loadChart } = await import("./load.server");
      return await loadChart(data.pool);
    } catch {
      return [];
    }
  });
