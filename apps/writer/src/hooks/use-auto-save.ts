"use client";

import { useRef, useCallback, useEffect } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { useUpdateChapterContent } from "@/hooks/use-chapters";

const AUTOSAVE_DELAY = 30_000; // 30 seconds
const STORAGE_PREFIX = "nbw_chapter_";

interface PendingContent {
  contentJson: string;
  contentHtml: string;
  wordCount: number;
}

export function useAutoSave(chapterId: string | null) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PendingContent | null>(null);

  const { currentVersion, setSaveStatus, setDirty, setLastSavedAt } = useEditorStore();
  const updateContent = useUpdateChapterContent();

  // Save to localStorage as backup
  const saveToLocalStorage = useCallback(
    (content: PendingContent) => {
      if (!chapterId) return;
      try {
        localStorage.setItem(
          `${STORAGE_PREFIX}${chapterId}`,
          JSON.stringify({
            chapterId,
            ...content,
            savedAt: new Date().toISOString(),
            version: currentVersion,
          })
        );
      } catch {
        // localStorage might be full - silently fail
      }
    },
    [chapterId, currentVersion]
  );

  // Clear localStorage backup after successful server save
  const clearLocalStorage = useCallback(
    () => {
      if (!chapterId) return;
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${chapterId}`);
      } catch {
        // ignore
      }
    },
    [chapterId]
  );

  // Perform save to server
  const performSave = useCallback(async () => {
    const content = pendingRef.current;
    if (!chapterId || !content) return;

    setSaveStatus("saving");
    try {
      const result = await updateContent.mutateAsync({
        id: chapterId,
        ...content,
        expectedVersion: currentVersion,
      });
      // Update version in store
      useEditorStore.getState().setCurrentChapter(chapterId, result.version);
      setDirty(false);
      setSaveStatus("saved");
      setLastSavedAt(new Date());
      clearLocalStorage();
      pendingRef.current = null;
    } catch (error: any) {
      if (error.message?.includes("409") || error.message?.includes("conflict") || error.message?.includes("Conflict")) {
        setSaveStatus("conflict");
      } else {
        setSaveStatus("error");
        // Save to localStorage as fallback
        saveToLocalStorage(content);
      }
    }
  }, [chapterId, currentVersion, updateContent, setSaveStatus, setDirty, setLastSavedAt, clearLocalStorage, saveToLocalStorage]);

  // Schedule a save
  const scheduleSave = useCallback(
    (contentJson: string, contentHtml: string, wordCount: number) => {
      pendingRef.current = { contentJson, contentHtml, wordCount };

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        performSave();
      }, AUTOSAVE_DELAY);
    },
    [performSave]
  );

  // Force immediate save (e.g., on blur or Ctrl+S)
  const saveNow = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    performSave();
  }, [performSave]);

  // Get recovery data from localStorage
  const getRecoveryData = useCallback((): PendingContent | null => {
    if (!chapterId) return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${chapterId}`);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        contentJson: data.contentJson,
        contentHtml: data.contentHtml,
        wordCount: data.wordCount,
      };
    } catch {
      return null;
    }
  }, [chapterId]);

  // Dismiss recovery data
  const dismissRecovery = useCallback(() => {
    clearLocalStorage();
  }, [clearLocalStorage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Save pending content on unmount
      if (pendingRef.current && chapterId) {
        saveToLocalStorage(pendingRef.current);
      }
    };
  }, [chapterId, saveToLocalStorage]);

  // Save on Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveNow]);

  return {
    scheduleSave,
    saveNow,
    getRecoveryData,
    dismissRecovery,
    isSaving: updateContent.isPending,
  };
}
