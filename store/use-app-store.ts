"use client";

import { create } from "zustand";

export type HistoryItem = {
  id: string;
  name: string;
  status: "Processed" | "Processing" | "Failed";
  createdAt: string;
  size: string;
};

type AppState = {
  credits: number;
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  spendCredit: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  credits: 428,
  history: [
    { id: "1", name: "founder-headshot.png", status: "Processed", createdAt: "Today", size: "2.4 MB" },
    { id: "2", name: "product-packshot.jpg", status: "Processed", createdAt: "Yesterday", size: "4.1 MB" },
    { id: "3", name: "campaign-batch.zip", status: "Processing", createdAt: "May 5", size: "18 MB" }
  ],
  addHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
  spendCredit: () => set((state) => ({ credits: Math.max(0, state.credits - 1) }))
}));
