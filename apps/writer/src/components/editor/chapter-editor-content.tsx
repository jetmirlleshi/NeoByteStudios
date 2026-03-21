"use client";

import { useChapter } from "@/hooks/use-chapters";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useEditorStore } from "@/stores/editor-store";
import { WriterEditor } from "./editor-content";
import { useCallback, useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ChapterEditorContentProps {
  projectId: string;
  chapterId: string;
}

export function ChapterEditorContent({ projectId, chapterId }: ChapterEditorContentProps) {
  const { data: chapter, isLoading, error } = useChapter(chapterId);
  const { scheduleSave, saveNow, getRecoveryData, dismissRecovery } = useAutoSave(chapterId);
  const { saveStatus, reset } = useEditorStore();
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryData, setRecoveryData] = useState<{
    contentJson: string;
    contentHtml: string;
    wordCount: number;
  } | null>(null);

  // Check for recovery data on mount
  useEffect(() => {
    const data = getRecoveryData();
    if (data) {
      setRecoveryData(data);
      setShowRecovery(true);
    }
  }, [getRecoveryData]);

  // Reset store on unmount
  useEffect(() => {
    return () => reset();
  }, [reset]);

  const handleContentChange = useCallback(
    (json: string, html: string, wordCount: number) => {
      scheduleSave(json, html, wordCount);
    },
    [scheduleSave]
  );

  const handleAcceptRecovery = () => {
    setShowRecovery(false);
    // Recovery data will be used as initial content
  };

  const handleDismissRecovery = () => {
    dismissRecovery();
    setRecoveryData(null);
    setShowRecovery(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Capitolo non trovato</p>
        <Link
          href={`/projects/${projectId}`}
          className="text-sm text-primary hover:underline"
        >
          Torna al progetto
        </Link>
      </div>
    );
  }

  // Use recovery data if accepted, otherwise use chapter data
  const initialContent =
    showRecovery && recoveryData ? recoveryData.contentJson : chapter.contentJson;

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <Link
          href={`/projects/${projectId}`}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Torna al progetto"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-sm font-medium">
          Cap. {chapter.number} — {chapter.title}
        </span>
        <div className="flex-1" />
        <button
          onClick={saveNow}
          disabled={saveStatus === "saving" || saveStatus === "saved"}
          className="rounded-md px-3 py-1 text-xs text-muted-foreground hover:bg-accent disabled:opacity-50"
        >
          Salva ora
        </button>
      </div>

      {/* Recovery banner */}
      {showRecovery && (
        <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="flex-1 text-sm text-yellow-800 dark:text-yellow-200">
            Trovato contenuto non salvato. Vuoi ripristinarlo?
          </span>
          <button
            onClick={handleAcceptRecovery}
            className="rounded-md bg-yellow-600 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-700"
          >
            Ripristina
          </button>
          <button
            onClick={handleDismissRecovery}
            className="rounded-md px-3 py-1 text-xs text-yellow-800 hover:bg-yellow-100 dark:text-yellow-200 dark:hover:bg-yellow-900/40"
          >
            Scarta
          </button>
        </div>
      )}

      {/* Conflict banner */}
      {saveStatus === "conflict" && (
        <div className="flex items-center gap-3 bg-red-50 px-4 py-2 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="flex-1 text-sm text-red-800 dark:text-red-200">
            Conflitto di versione: il capitolo è stato modificato altrove. Ricarica la pagina.
          </span>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
          >
            Ricarica
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <WriterEditor
          chapterId={chapterId}
          chapterNumber={chapter.number}
          chapterTitle={chapter.title}
          initialContent={initialContent || undefined}
          initialVersion={chapter.version}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
}
