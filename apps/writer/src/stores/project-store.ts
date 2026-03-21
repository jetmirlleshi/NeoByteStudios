import { create } from "zustand";

interface ProjectState {
  currentProjectId: string | null;
  setCurrentProject: (id: string | null) => void;

  // Lookup maps for editor mentions (populated when project is open)
  characterLookup: Map<string, string>; // id → name
  locationLookup: Map<string, string>; // id → name
  setCharacterLookup: (map: Map<string, string>) => void;
  setLocationLookup: (map: Map<string, string>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProjectId: null,
  setCurrentProject: (id) => set({ currentProjectId: id }),

  characterLookup: new Map(),
  locationLookup: new Map(),
  setCharacterLookup: (map) => set({ characterLookup: map }),
  setLocationLookup: (map) => set({ locationLookup: map }),
}));
