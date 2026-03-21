"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chapterKeys } from "./use-chapters";
import { characterKeys } from "./use-characters";
import { locationKeys } from "./use-locations";
import { itemKeys } from "./use-items";
import { factionKeys } from "./use-factions";

// --- Types ---

export interface TrashData {
  chapters: { id: string; title: string; number: number; deletedAt: string }[];
  characters: {
    id: string;
    name: string;
    role: string;
    deletedAt: string;
  }[];
  locations: {
    id: string;
    name: string;
    type: string | null;
    deletedAt: string;
  }[];
  items: {
    id: string;
    name: string;
    type: string | null;
    deletedAt: string;
  }[];
  factions: { id: string; name: string; deletedAt: string }[];
}

type EntityType = "chapter" | "character" | "location" | "item" | "faction";

// --- Query Keys ---

export const trashKeys = {
  all: ["trash"] as const,
  list: (projectId: string) => [...trashKeys.all, projectId] as const,
};

// --- Fetchers ---

async function fetchTrash(projectId: string): Promise<TrashData> {
  const res = await fetch(`/api/projects/${projectId}/trash`);
  if (!res.ok) throw new Error("Failed to fetch trash");
  return res.json();
}

async function restoreItem(data: {
  projectId: string;
  entityType: EntityType;
  entityId: string;
}): Promise<{ success: boolean }> {
  const { projectId, entityType, entityId } = data;
  const res = await fetch(`/api/projects/${projectId}/trash/restore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityType, entityId }),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to restore item" }));
    throw new Error(err.error);
  }
  return res.json();
}

// --- Hooks ---

export function useTrash(projectId: string) {
  return useQuery({
    queryKey: trashKeys.list(projectId),
    queryFn: () => fetchTrash(projectId),
    enabled: !!projectId,
  });
}

export function useRestoreItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreItem,
    onSuccess: (_data, variables) => {
      // Invalidate trash list
      queryClient.invalidateQueries({
        queryKey: trashKeys.list(variables.projectId),
      });

      // Invalidate the relevant entity list so the restored item appears
      switch (variables.entityType) {
        case "chapter":
          queryClient.invalidateQueries({
            queryKey: chapterKeys.list(variables.projectId),
          });
          break;
        case "character":
          queryClient.invalidateQueries({
            queryKey: characterKeys.lists(),
          });
          break;
        case "location":
          queryClient.invalidateQueries({
            queryKey: locationKeys.lists(),
          });
          break;
        case "item":
          queryClient.invalidateQueries({
            queryKey: itemKeys.lists(),
          });
          break;
        case "faction":
          queryClient.invalidateQueries({
            queryKey: factionKeys.list(variables.projectId),
          });
          break;
      }
    },
  });
}
