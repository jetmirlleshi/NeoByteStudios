"use client";

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AISuggestion {
  type: string; // "plot" | "character" | "setting" | "dialogue" | "tension"
  title: string;
  description: string;
}

interface GenerationHistoryEntry {
  type: string;
  text: string;
  timestamp: Date;
}

interface AIState {
  // Generation streaming
  isGenerating: boolean;
  generatedText: string;
  generationType: string | null;
  setGenerating: (generating: boolean) => void;
  appendText: (text: string) => void;
  clearGenerated: () => void;
  setGenerationType: (type: string | null) => void;

  // Suggestions
  suggestions: AISuggestion[];
  setSuggestions: (suggestions: AISuggestion[]) => void;
  clearSuggestions: () => void;

  // History (last 10 generations)
  generationHistory: GenerationHistoryEntry[];
  addToHistory: (type: string, text: string) => void;

  // Panel state
  aiPanelOpen: boolean;
  aiPanelTab: string; // "generate" | "suggestions" | "search"
  setAIPanelOpen: (open: boolean) => void;
  setAIPanelTab: (tab: string) => void;

  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const MAX_HISTORY = 10;

const initialState = {
  isGenerating: false,
  generatedText: "",
  generationType: null as string | null,
  suggestions: [] as AISuggestion[],
  generationHistory: [] as GenerationHistoryEntry[],
  aiPanelOpen: false,
  aiPanelTab: "generate",
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAIStore = create<AIState>((set) => ({
  ...initialState,

  // --- Generation streaming ---

  setGenerating: (generating) => set({ isGenerating: generating }),

  appendText: (text) =>
    set((state) => ({ generatedText: state.generatedText + text })),

  clearGenerated: () => set({ generatedText: "", generationType: null }),

  setGenerationType: (type) => set({ generationType: type }),

  // --- Suggestions ---

  setSuggestions: (suggestions) => set({ suggestions }),

  clearSuggestions: () => set({ suggestions: [] }),

  // --- History ---

  addToHistory: (type, text) =>
    set((state) => {
      const entry: GenerationHistoryEntry = {
        type,
        text,
        timestamp: new Date(),
      };
      // Keep only the last MAX_HISTORY entries (newest at the front)
      const updated = [entry, ...state.generationHistory].slice(0, MAX_HISTORY);
      return { generationHistory: updated };
    }),

  // --- Panel state ---

  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),

  setAIPanelTab: (tab) => set({ aiPanelTab: tab, aiPanelOpen: true }),

  // --- Reset ---

  reset: () => set(initialState),
}));
