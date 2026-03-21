import { create } from "zustand";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error" | "conflict";

interface EditorState {
  // Editor lifecycle
  isReady: boolean;
  setReady: (ready: boolean) => void;

  // Current chapter tracking
  currentChapterId: string | null;
  currentVersion: number;
  setCurrentChapter: (id: string | null, version?: number) => void;

  // Content dirty tracking
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;

  // Save status
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  lastSavedAt: Date | null;
  setLastSavedAt: (date: Date | null) => void;

  // Word count
  wordCount: number;
  setWordCount: (count: number) => void;

  // UI panels
  rightPanelOpen: boolean;
  rightPanelTab: string;
  setRightPanelOpen: (open: boolean) => void;
  setRightPanelTab: (tab: string) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  isReady: false,
  currentChapterId: null,
  currentVersion: 0,
  isDirty: false,
  saveStatus: "saved" as SaveStatus,
  lastSavedAt: null,
  wordCount: 0,
  rightPanelOpen: false,
  rightPanelTab: "info",
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,

  setReady: (ready) => set({ isReady: ready }),

  setCurrentChapter: (id, version = 0) =>
    set({ currentChapterId: id, currentVersion: version, isDirty: false, saveStatus: "saved" }),

  setDirty: (dirty) =>
    set((state) => ({
      isDirty: dirty,
      saveStatus: dirty ? "unsaved" : state.saveStatus,
    })),

  setSaveStatus: (status) => set({ saveStatus: status }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),
  setWordCount: (count) => set({ wordCount: count }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab, rightPanelOpen: true }),

  reset: () => set(initialState),
}));
