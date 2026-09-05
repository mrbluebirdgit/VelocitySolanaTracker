import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WatchItem = {
  mint: string;
  symbol: string;
  name: string;
  addedAt: number;
};

export type AlertItem = {
  id: string;
  mint: string;
  symbol: string;
  kind: "spike" | "dump" | "flow";
  message: string;
  at: number;
};

type WatchState = {
  items: WatchItem[];
  alerts: AlertItem[];
  toggle: (item: Omit<WatchItem, "addedAt">) => void;
  has: (mint: string) => boolean;
  pushAlert: (alert: Omit<AlertItem, "id" | "at">) => void;
  clearAlerts: () => void;
};

export const useWatchlist = create<WatchState>()(
  persist(
    (set, get) => ({
      items: [],
      alerts: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.mint === item.mint);
        set({
          items: exists
            ? get().items.filter((i) => i.mint !== item.mint)
            : [{ ...item, addedAt: Date.now() }, ...get().items].slice(0, 24),
        });
      },
      has: (mint) => get().items.some((i) => i.mint === mint),
      pushAlert: (alert) => {
        const id = `${alert.mint}-${alert.kind}-${Math.floor(Date.now() / 30_000)}`;
        if (get().alerts.some((a) => a.id === id)) return;
        set({
          alerts: [{ ...alert, id, at: Date.now() }, ...get().alerts].slice(0, 40),
        });
      },
      clearAlerts: () => set({ alerts: [] }),
    }),
    { name: "velocity-watch" },
  ),
);
