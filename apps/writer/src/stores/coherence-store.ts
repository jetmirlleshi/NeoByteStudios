"use client";

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CoherenceAlert {
  /** Undefined for tier 1 local alerts (client-side only) */
  id?: string;
  type: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  description: string;
  characterId?: string;
  textSnippet?: string;
  suggestion?: string;
  status?: string;
  tier: 1 | 2 | 3;
}

interface CoherenceState {
  /** Server-side alerts (Tier 2 & 3) */
  alerts: CoherenceAlert[];
  /** Client-side regex alerts (Tier 1, always current) */
  tier1Alerts: CoherenceAlert[];
  isChecking: boolean;
  lastCheckAt: Date | null;

  setAlerts: (alerts: CoherenceAlert[]) => void;
  addAlerts: (alerts: CoherenceAlert[]) => void;
  setTier1Alerts: (alerts: CoherenceAlert[]) => void;
  setChecking: (checking: boolean) => void;
  dismissAlert: (index: number) => void;
  clearAlerts: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState = {
  alerts: [] as CoherenceAlert[],
  tier1Alerts: [] as CoherenceAlert[],
  isChecking: false,
  lastCheckAt: null as Date | null,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCoherenceStore = create<CoherenceState>((set) => ({
  ...initialState,

  setAlerts: (alerts) =>
    set({ alerts, lastCheckAt: new Date() }),

  addAlerts: (newAlerts) =>
    set((state) => ({
      alerts: [...state.alerts, ...newAlerts],
      lastCheckAt: new Date(),
    })),

  setTier1Alerts: (alerts) =>
    set({ tier1Alerts: alerts }),

  setChecking: (checking) =>
    set({ isChecking: checking }),

  dismissAlert: (index) =>
    set((state) => ({
      alerts: state.alerts.filter((_, i) => i !== index),
    })),

  clearAlerts: () =>
    set({ alerts: [], tier1Alerts: [] }),

  reset: () => set(initialState),
}));
