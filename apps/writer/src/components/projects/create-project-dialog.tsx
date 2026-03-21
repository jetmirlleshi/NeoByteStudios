"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateProject } from "@/hooks/use-projects";
import { toast } from "sonner";

const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Horror",
  "Romance",
  "Thriller",
  "Mystery",
  "Literary Fiction",
  "Historical Fiction",
  "Urban Fantasy",
  "Dark Fantasy",
  "Space Opera",
  "Dystopia",
];

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const createProject = useCreateProject();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Il titolo è obbligatorio");
      return;
    }

    try {
      await createProject.mutateAsync({
        title: title.trim(),
        genre: genre || undefined,
        description: description.trim() || undefined,
      });
      toast.success("Progetto creato!");
      setTitle("");
      setGenre("");
      setDescription("");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-xl border bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-bold">Nuovo progetto</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Crea un nuovo romanzo e inizia a scrivere.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="project-title"
              className="mb-1 block text-sm font-medium"
            >
              Titolo *
            </label>
            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Il titolo del tuo romanzo..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
              autoFocus
            />
          </div>

          {/* Genre */}
          <div>
            <label
              htmlFor="project-genre"
              className="mb-1 block text-sm font-medium"
            >
              Genere
            </label>
            <select
              id="project-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="">Seleziona genere...</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="project-description"
              className="mb-1 block text-sm font-medium"
            >
              Descrizione
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Una breve descrizione della tua storia..."
              rows={3}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={createProject.isPending}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {createProject.isPending ? "Creazione..." : "Crea progetto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
