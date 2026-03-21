"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Loader2,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  useChapters,
  useCreateChapter,
  useDeleteChapter,
} from "@/hooks/use-chapters";
import type { Chapter } from "@/hooks/use-chapters";
import { toast } from "sonner";

// --- Status config ---

const STATUS_LABELS: Record<string, string> = {
  IDEA: "Idea",
  OUTLINE: "Outline",
  DRAFT: "Bozza",
  REVISION: "Revisione",
  COMPLETE: "Completato",
};

const STATUS_COLORS: Record<string, string> = {
  IDEA: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  OUTLINE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DRAFT: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  REVISION: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  COMPLETE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

// --- Props ---

interface ChapterListProps {
  projectId: string;
}

// --- Component ---

export function ChapterList({ projectId }: ChapterListProps) {
  const { data: chapters, isLoading } = useChapters(projectId);
  const createChapter = useCreateChapter();
  const deleteChapter = useDeleteChapter();

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const sortedChapters = [...(chapters ?? [])].sort((a, b) => a.order - b.order);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      toast.error("Il titolo è obbligatorio");
      return;
    }

    try {
      await createChapter.mutateAsync({
        projectId,
        title: newTitle.trim(),
      });
      toast.success("Capitolo creato!");
      setNewTitle("");
      setShowForm(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo capitolo?")) return;
    try {
      await deleteChapter.mutateAsync(id);
      toast.success("Capitolo eliminato");
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  };

  // --- Loading state ---

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // --- Empty state ---

  if (sortedChapters.length === 0 && !showForm) {
    return (
      <div className="rounded-lg border p-12 text-center dark:border-gray-800">
        <FileText className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
        <h3 className="mt-4 font-medium">Nessun capitolo</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Aggiungi il primo capitolo per iniziare a scrivere.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Aggiungi capitolo
        </button>
      </div>
    );
  }

  // --- List state ---

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Capitoli</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Nuovo capitolo
        </button>
      </div>

      {/* Inline create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-4 flex items-center gap-3 rounded-lg border p-4 dark:border-gray-800"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titolo del capitolo..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            autoFocus
          />
          <button
            type="submit"
            disabled={createChapter.isPending}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {createChapter.isPending ? "Creazione..." : "Aggiungi"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setNewTitle("");
            }}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Annulla
          </button>
        </form>
      )}

      {/* Chapter cards */}
      <div className="mt-4 space-y-3">
        {sortedChapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            projectId={projectId}
            menuOpen={menuOpenId === chapter.id}
            onMenuToggle={(id) =>
              setMenuOpenId(menuOpenId === id ? null : id)
            }
            onMenuClose={() => setMenuOpenId(null)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

// --- Chapter Card ---

interface ChapterCardProps {
  chapter: Chapter;
  projectId: string;
  menuOpen: boolean;
  onMenuToggle: (id: string) => void;
  onMenuClose: () => void;
  onDelete: (id: string) => void;
}

function ChapterCard({
  chapter,
  projectId,
  menuOpen,
  onMenuToggle,
  onMenuClose,
  onDelete,
}: ChapterCardProps) {
  const router = useRouter();
  const statusColor =
    STATUS_COLORS[chapter.status] ?? STATUS_COLORS.DRAFT;
  const statusLabel =
    STATUS_LABELS[chapter.status] ?? chapter.status;

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border p-4 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600">
      {/* Chapter number */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        {chapter.number}
      </div>

      {/* Title + meta */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{chapter.title}</h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {statusLabel}
          </span>
          <span>{chapter.wordCount.toLocaleString("it-IT")} parole</span>
        </div>
      </div>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => onMenuToggle(chapter.id)}
          className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-800"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={onMenuClose}
            />
            <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => {
                  router.push(`/dashboard/projects/${projectId}/chapters/${chapter.id}`);
                  onMenuClose();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Modifica
              </button>
              <button
                onClick={() => {
                  onDelete(chapter.id);
                  onMenuClose();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Elimina
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
