import { create } from "zustand";

interface BillingStore {
  upgradeDialogOpen: boolean;
  upgradeFeature: string | null;
  openUpgradeDialog: (feature: string) => void;
  closeUpgradeDialog: () => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  upgradeDialogOpen: false,
  upgradeFeature: null,
  openUpgradeDialog: (feature) =>
    set({ upgradeDialogOpen: true, upgradeFeature: feature }),
  closeUpgradeDialog: () =>
    set({ upgradeDialogOpen: false, upgradeFeature: null }),
}));
