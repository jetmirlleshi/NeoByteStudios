"use client";

import { useState } from "react";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import {
  useTimelineEvents,
  useCreateTimelineEvent,
  useDeleteTimelineEvent,
} from "@/hooks/use-timeline";
import type { TimelineEvent } from "@/hooks/use-timeline";
import { Loader2, Plus, Clock, Trash2, X } from "lucide-react";
import { toast } from "sonner";

// --- Badge helpers ---

const typeBadgeColors: Record<string, string> = {
  HISTORICAL: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  STORY: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  FUTURE: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const typeLabels: Record<string, string> = {
  HISTORICAL: "Storico",
  STORY: "Narrativo",
  FUTURE: "Futuro",
};

// --- Inner content component ---

function TimelineInner({ projectId }: { projectId: string }) {
  const { data, isLoading } = useTimelineEvents(projectId);
  const createMutation = useCreateTimelineEvent();
  const deleteMutation = useDeleteTimelineEvent();

  const [showDialog, setShowDialog] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formEra, setFormEra] = useState("");
  const [formType, setFormType] = useState("STORY");

  const items = data?.items ?? [];
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim()) return;

    // Auto-calculate order: append at end
    const maxOrder = items.reduce((max, ev) => Math.max(max, ev.order), 0);

    try {
      await createMutation.mutateAsync({
        projectId,
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        date: formDate.trim() || undefined,
        era: formEra.trim() || undefined,
        type: formType,
        order: maxOrder + 1,
      });
      toast.success("Evento creato con successo");
      setShowDialog(false);
      setFormTitle("");
      setFormDescription("");
      setFormDate("");
      setFormEra("");
      setFormType("STORY");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Eliminare l'evento "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Evento eliminato");
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Aggiungi
        </button>
      </div>

      {/* Empty state */}
      {sortedItems.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <div>
            <h3 className="font-medium">Nessun evento ancora</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Crea eventi per costruire la cronologia del tuo mondo.
            </p>
          </div>
        </div>
      )}

      {/* Vertical timeline */}
      {sortedItems.length > 0 && (
        <div className="relative ml-4">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-6">
            {sortedItems.map((event: TimelineEvent) => (
              <div key={event.id} className="group relative pl-8">
                {/* Dot on the line */}
                <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 dark:border-gray-900" />

                <div className="rounded-lg border p-4 dark:border-gray-800">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {/* Title */}
                      <h3 className="font-semibold">{event.title}</h3>

                      {/* Date/Era & Type row */}
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeColors[event.type] ?? typeBadgeColors.STORY}`}
                        >
                          {typeLabels[event.type] ?? event.type}
                        </span>
                        {event.date && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {event.date}
                          </span>
                        )}
                        {event.era && (
                          <span className="text-xs italic text-gray-500 dark:text-gray-400">
                            {event.era}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {event.description && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      className="flex-shrink-0 rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuovo Evento</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="rounded p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Titolo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Titolo dell'evento"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Descrizione
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Descrivi l'evento..."
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-1 block text-sm font-medium">Data</label>
                <input
                  type="text"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="es. Anno 1042, 3a Era..."
                />
              </div>

              {/* Era */}
              <div>
                <label className="mb-1 block text-sm font-medium">Era</label>
                <input
                  type="text"
                  value={formEra}
                  onChange={(e) => setFormEra(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="es. Prima Era, Epoca d'Oro..."
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-1 block text-sm font-medium">Tipo</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Exported wrapper ---

export function TimelineContent() {
  return (
    <ProjectSelector>
      {(projectId) => <TimelineInner projectId={projectId} />}
    </ProjectSelector>
  );
}
