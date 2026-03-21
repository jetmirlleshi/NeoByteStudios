"use client";

import { useEditorStore, type SaveStatus } from "@/stores/editor-store";
import { Loader2 } from "lucide-react";

const statusConfig: Record<SaveStatus, { label: string; className: string }> = {
  saved: { label: "Salvato", className: "text-muted-foreground" },
  saving: { label: "Salvataggio...", className: "text-blue-500" },
  unsaved: { label: "Modifiche non salvate", className: "text-yellow-500" },
  error: { label: "Errore di salvataggio", className: "text-destructive" },
  conflict: { label: "Conflitto di versione", className: "text-destructive" },
};

interface EditorStatusBarProps {
  chapterTitle?: string;
  chapterNumber?: number;
}

export function EditorStatusBar({ chapterTitle, chapterNumber }: EditorStatusBarProps) {
  const { wordCount, saveStatus, lastSavedAt } = useEditorStore();
  const config = statusConfig[saveStatus];

  return (
    <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        {chapterNumber != null && (
          <span>
            Cap. {chapterNumber}{chapterTitle ? ` — ${chapterTitle}` : ""}
          </span>
        )}
        <span>{wordCount.toLocaleString("it-IT")} parole</span>
      </div>

      <div className="flex items-center gap-4">
        {lastSavedAt && (
          <span>
            Ultimo salvataggio:{" "}
            {new Date(lastSavedAt).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
        <span className={`flex items-center gap-1.5 ${config.className}`}>
          {saveStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
          {config.label}
        </span>
      </div>
    </div>
  );
}
