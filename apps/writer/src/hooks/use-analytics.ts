"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface ProjectStats {
  totalWords: number;
  totalChapters: number;
  chaptersByStatus: Record<string, number>;
  characterCount: number;
  activeAlertsCount: number;
  todayWords: number;
  weeklyWords: number;
  currentStreak: number;
}

export interface DailyProgress {
  date: string;
  wordsWritten: number;
  cumulativeWords: number;
}

export interface CalendarDay {
  date: string;
  wordsWritten: number;
}

export interface CalendarData {
  days: CalendarDay[];
  currentStreak: number;
  longestStreak: number;
}

export interface CharacterAnalytics {
  id: string;
  name: string;
  role: string;
  appearances: number;
  povCount: number;
  isUnused: boolean;
}

export interface TextAnalysis {
  topWords: Array<{ word: string; count: number }>;
  sentenceStats: {
    avg: number;
    median: number;
    min: number;
    max: number;
    distribution: { short: number; medium: number; long: number };
  };
  dialogueRatio: number;
  gulpease: number;
  typeTokenRatio: number;
}

// --- Query Keys ---

export const analyticsKeys = {
  all: ["analytics"] as const,
  stats: (projectId: string) =>
    [...analyticsKeys.all, "stats", projectId] as const,
  progress: (projectId: string, days: number) =>
    [...analyticsKeys.all, "progress", projectId, days] as const,
  calendar: (projectId: string, year: number) =>
    [...analyticsKeys.all, "calendar", projectId, year] as const,
  characters: (projectId: string) =>
    [...analyticsKeys.all, "characters", projectId] as const,
  textAnalysis: (projectId: string) =>
    [...analyticsKeys.all, "text-analysis", projectId] as const,
};

// --- Fetchers ---

async function fetchProjectStats(projectId: string): Promise<ProjectStats> {
  const res = await fetch(`/api/projects/${projectId}/stats`);
  if (!res.ok) throw new Error("Failed to fetch project stats");
  return res.json();
}

async function fetchProgress(
  projectId: string,
  days: number
): Promise<DailyProgress[]> {
  const res = await fetch(
    `/api/projects/${projectId}/analytics/progress?days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch progress data");
  return res.json();
}

async function fetchCalendar(
  projectId: string,
  year: number
): Promise<CalendarData> {
  const res = await fetch(
    `/api/projects/${projectId}/analytics/calendar?year=${year}`
  );
  if (!res.ok) throw new Error("Failed to fetch calendar data");
  return res.json();
}

async function fetchCharacterAnalytics(
  projectId: string
): Promise<CharacterAnalytics[]> {
  const res = await fetch(
    `/api/projects/${projectId}/analytics/characters`
  );
  if (!res.ok) throw new Error("Failed to fetch character analytics");
  return res.json();
}

async function fetchTextAnalysis(
  projectId: string
): Promise<TextAnalysis> {
  const res = await fetch(
    `/api/projects/${projectId}/analytics/text-analysis`
  );
  if (!res.ok) throw new Error("Failed to fetch text analysis");
  return res.json();
}

async function trackSession(data: {
  projectId: string;
  wordsWritten: number;
  startedAt: string;
  endedAt: string;
}): Promise<{ success: boolean }> {
  const { projectId, ...body } = data;
  const res = await fetch(
    `/api/projects/${projectId}/analytics/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to track session" }));
    throw new Error(err.error);
  }
  return res.json();
}

// --- Hooks ---

export function useProjectStats(projectId: string) {
  return useQuery({
    queryKey: analyticsKeys.stats(projectId),
    queryFn: () => fetchProjectStats(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProgress(projectId: string, days = 90) {
  return useQuery({
    queryKey: analyticsKeys.progress(projectId, days),
    queryFn: () => fetchProgress(projectId, days),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCalendar(
  projectId: string,
  year = new Date().getFullYear()
) {
  return useQuery({
    queryKey: analyticsKeys.calendar(projectId, year),
    queryFn: () => fetchCalendar(projectId, year),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCharacterAnalytics(projectId: string) {
  return useQuery({
    queryKey: analyticsKeys.characters(projectId),
    queryFn: () => fetchCharacterAnalytics(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTextAnalysis(projectId: string) {
  return useQuery({
    queryKey: analyticsKeys.textAnalysis(projectId),
    queryFn: () => fetchTextAnalysis(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrackSession(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      wordsWritten: number;
      startedAt: string;
      endedAt: string;
    }) => trackSession({ projectId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: analyticsKeys.stats(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: analyticsKeys.progress(projectId, 90),
      });
      queryClient.invalidateQueries({
        queryKey: analyticsKeys.calendar(
          projectId,
          new Date().getFullYear()
        ),
      });
    },
  });
}
