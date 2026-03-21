"use client";

import { useProject } from "@/hooks/use-projects";
import { useChapters, useCreateChapter, useDeleteChapter } from "@/hooks/use-chapters";
import { useProjectStore } from "@/stores/project-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  FileText,
  Users,
  MapPin,
  ArrowLeft,
  MoreVertical,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  IDEA: "Idea",
  OUTLINE: "Bozza struttura",
  DRAFT: "Prima stesura",
  REVISION: "Revisione",
  COMPLETE: "Completato",
};

const statusColors: Record<string, string> = {
  IDEA: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  OUTLINE: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  DRAFT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  REVISION: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  COMPLETE: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

interface ProjectDetailContentProps {
  projectId: string;
}

export function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const router = useRouter();
  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  const { data: chapters, isLoading: chaptersLoading } = useChapters(projectId);
  const createChapter = useCreateChapter();
  const deleteChapter = useDeleteChapter();
  const { setCurrentProject } = useProjectStore();

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [showNewChapter, setShowNewChapter] = useState(false);

  useEffect(() => {
    setCurrentProject(projectId);
    return () => setCurrentProject(null);
  }, [projectId, setCurrentProject]);

  const project = projectData?.project;

  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim()) return;
    try {
      await createChapter.mutateAsync({
        projectId,
        title: newChapterTitle.trim(),
      });
      setNewChapterTitle("");
      setShowNewChapter(false);
      toast.success("Capitolo creato");
    } catch (error: any) {
      toast.error(error.message || "Errore nella creazione del capitolo");
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      await deleteChapter.mutateAsync(chapterId);
      toast.success("Capitolo eliminato");
    } catch {
      toast.error("Errore nell'eliminazione del capitolo");
    }
  };

  if (projectLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Progetto non trovato
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            {project.subtitle && (
              <p className="mt-1 text-lg text-muted-foreground">{project.subtitle}</p>
            )}
            {project.description && (
              <p className="mt-2 text-muted-foreground">{project.description}</p>
            )}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              statusColors[project.status] ?? statusColors.IDEA
            }`}
          >
            {statusLabels[project.status] ?? project.status}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Capitoli
            </div>
            <p className="mt-1 text-2xl font-bold">{project.chapterCount ?? 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              Parole
            </div>
            <p className="mt-1 text-2xl font-bold">
              {(project.totalWords ?? 0).toLocaleString("it-IT")}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Personaggi
            </div>
            <p className="mt-1 text-2xl font-bold">{project.characterCount ?? 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Luoghi
            </div>
            <p className="mt-1 text-2xl font-bold">{project.locationCount ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Capitoli</h2>
          <button
            onClick={() => setShowNewChapter(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuovo capitolo
          </button>
        </div>

        {showNewChapter && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Titolo del capitolo..."
              className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateChapter();
                if (e.key === "Escape") setShowNewChapter(false);
              }}
              autoFocus
            />
            <button
              onClick={handleCreateChapter}
              disabled={createChapter.isPending || !newChapterTitle.trim()}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Crea
            </button>
            <button
              onClick={() => setShowNewChapter(false)}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
            >
              Annulla
            </button>
          </div>
        )}

        {chaptersLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : !chapters || chapters.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed p-12 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-30" />
            <p className="mt-3 text-sm">Nessun capitolo ancora</p>
            <p className="text-xs">Crea il tuo primo capitolo per iniziare a scrivere</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map((chapter: any) => (
              <div
                key={chapter.id}
                className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {chapter.number}
                </span>

                <button
                  onClick={() =>
                    router.push(`/projects/${projectId}/chapters/${chapter.id}`)
                  }
                  className="flex flex-1 flex-col items-start text-left"
                >
                  <span className="font-medium">{chapter.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {chapter.wordCount.toLocaleString("it-IT")} parole
                    {chapter.pov && ` — POV: ${chapter.pov}`}
                  </span>
                </button>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    statusColors[chapter.status] ?? statusColors.IDEA
                  }`}
                >
                  {statusLabels[chapter.status] ?? chapter.status}
                </span>

                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="rounded-md p-1.5 text-muted-foreground opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  title="Elimina capitolo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
