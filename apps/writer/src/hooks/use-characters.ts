"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface Character {
  id: string;
  projectId: string;
  name: string;
  fullName: string | null;
  aliases: string[] | null;
  age: number | null;
  role: string;
  status: string;
  factionId: string | null;
  height: string | null;
  build: string | null;
  hairColor: string | null;
  hairStyle: string | null;
  eyeColor: string | null;
  skinTone: string | null;
  distinctiveFeatures: string | null;
  clothing: string | null;
  personality: string | null;
  motivation: string | null;
  fears: string[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  fatalFlaw: string | null;
  secrets: string | null;
  backstory: string | null;
  speechPattern: string | null;
  vocabulary: string | null;
  catchPhrases: string[] | null;
  neverSays: string[] | null;
  verbosity: string | null;
  arcStart: string | null;
  arcMidpoint: string | null;
  arcCrisis: string | null;
  arcEnd: string | null;
  arcLesson: string | null;
  abilities: string | null;
  limitations: string | null;
  imageUrl: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CharacterFilters {
  role?: string;
}

// --- Query Keys ---

export const characterKeys = {
  all: ["characters"] as const,
  lists: () => [...characterKeys.all, "list"] as const,
  list: (projectId: string, filters?: CharacterFilters) =>
    [...characterKeys.lists(), projectId, filters] as const,
  details: () => [...characterKeys.all, "detail"] as const,
  detail: (id: string) => [...characterKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchCharacters(
  projectId: string,
  filters: CharacterFilters = {}
): Promise<{ items: Character[] }> {
  const params = new URLSearchParams();
  if (filters.role) params.set("role", filters.role);

  const qs = params.toString();
  const url = `/api/projects/${projectId}/characters${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json();
}

async function fetchCharacter(id: string): Promise<{ character: Character }> {
  const res = await fetch(`/api/characters/${id}`);
  if (!res.ok) throw new Error("Failed to fetch character");
  return res.json();
}

async function createCharacter(data: {
  projectId: string;
  name: string;
  role?: string;
  [key: string]: unknown;
}): Promise<{ character: Character }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create character" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateCharacter(data: {
  id: string;
  [key: string]: unknown;
}): Promise<{ character: Character }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/characters/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update character" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteCharacter(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete character");
  return res.json();
}

// --- Hooks ---

export function useCharacters(projectId: string, filters: CharacterFilters = {}) {
  return useQuery({
    queryKey: characterKeys.list(projectId, filters),
    queryFn: () => fetchCharacters(projectId, filters),
    enabled: !!projectId,
  });
}

export function useCharacter(id: string | null) {
  return useQuery({
    queryKey: characterKeys.detail(id!),
    queryFn: () => fetchCharacter(id!),
    enabled: !!id,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCharacter,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: characterKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCharacter,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: characterKeys.list(data.character.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: characterKeys.detail(data.character.id),
      });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () => {
      // Invalidate all character lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: characterKeys.lists() });
    },
  });
}
