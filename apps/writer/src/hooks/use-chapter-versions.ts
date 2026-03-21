"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chapterKeys } from "./use-chapters";

// --- Types ---

export interface ChapterVersion {
  id: string;
  chapterId: string;
  contentJson: string;
  wordCount: number;
  createdAt: string;
}

// --- Query Keys ---

export const versionKeys = {
  all: ["chapter-versions"] as const,
  list: (chapterId: string) => [...versionKeys.all, chapterId] as const,
};

// --- Fetchers ---

async function fetchVersions(chapterId: string): Promise<ChapterVersion[]> {
  const res = await fetch(`/api/chapters/${chapterId}/versions`);
  if (!res.ok) throw new Error("Failed to fetch chapter versions");
  const data = await res.json();
  return data.versions;
}

async function createVersion(chapterId: string): Promise<ChapterVersion> {
  const res = await fetch(`/api/chapters/${chapterId}/versions`, {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create version" }));
    throw new Error(err.error);
  }
  const data = await res.json();
  return data.version;
}

async function restoreVersion(data: {
  chapterId: string;
  versionId: string;
}): Promise<{ chapter: Record<string, unknown> }> {
  const { chapterId, versionId } = data;
  const res = await fetch(
    `/api/chapters/${chapterId}/versions/${versionId}/restore`,
    { method: "POST" }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to restore version" }));
    throw new Error(err.error);
  }
  return res.json();
}

// --- Hooks ---

export function useChapterVersions(chapterId: string | null) {
  return useQuery({
    queryKey: versionKeys.list(chapterId!),
    queryFn: () => fetchVersions(chapterId!),
    enabled: !!chapterId,
  });
}

export function useCreateVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVersion,
    onSuccess: (_data, chapterId) => {
      queryClient.invalidateQueries({ queryKey: versionKeys.list(chapterId) });
    },
  });
}

export function useRestoreVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreVersion,
    onSuccess: (_data, variables) => {
      // Invalidate versions list so it refreshes
      queryClient.invalidateQueries({
        queryKey: versionKeys.list(variables.chapterId),
      });
      // Invalidate chapter detail so the editor picks up restored content
      queryClient.invalidateQueries({
        queryKey: chapterKeys.detail(variables.chapterId),
      });
    },
  });
}
