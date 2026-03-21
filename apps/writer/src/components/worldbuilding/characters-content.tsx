"use client";

import { useState } from "react";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import {
  useCharacters,
  useCreateCharacter,
  useDeleteCharacter,
} from "@/hooks/use-characters";
import type { Character } from "@/hooks/use-characters";
import { Loader2, Plus, Users, Trash2, X } from "lucide-react";
import { toast } from "sonner";

// --- Badge helpers ---

const roleBadgeColors: Record<string, string> = {
  PROTAGONIST: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  ANTAGONIST: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  DEUTERAGONIST: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  MENTOR: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  LOVE_INTEREST: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  SIDEKICK: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  SUPPORTING: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  MINOR: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const roleLabels: Record<string, string> = {
  PROTAGONIST: "Protagonista",
  ANTAGONIST: "Antagonista",
  DEUTERAGONIST: "Deuteragonista",
  MENTOR: "Mentore",
  LOVE_INTEREST: "Interesse Amoroso",
  SIDEKICK: "Spalla",
  SUPPORTING: "Supporto",
  MINOR: "Minore",
};

const statusIndicators: Record<string, { color: string; label: string }> = {
  ALIVE: { color: "bg-green-500", label: "Vivo" },
  DEAD: { color: "bg-red-500", label: "Morto" },
  UNKNOWN: { color: "bg-gray-400", label: "Sconosciuto" },
  TRANSFORMED: { color: "bg-purple-500", label: "Trasformato" },
};

// --- Inner content component ---

function CharactersInner({ projectId }: { projectId: string }) {
  const { data, isLoading } = useCharacters(projectId);
  const createMutation = useCreateCharacter();
  const deleteMutation = useDeleteCharacter();

  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("SUPPORTING");
  const [formAge, setFormAge] = useState("");
  const [formPersonality, setFormPersonality] = useState("");

  const items = data?.items ?? [];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      await createMutation.mutateAsync({
        projectId,
        name: formName.trim(),
        role: formRole,
        age: formAge ? Number(formAge) : undefined,
        personality: formPersonality.trim() || undefined,
      });
      toast.success("Personaggio creato con successo");
      setShowDialog(false);
      setFormName("");
      setFormRole("SUPPORTING");
      setFormAge("");
      setFormPersonality("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminare il personaggio "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Personaggio eliminato");
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
        <h1 className="text-2xl font-bold">Personaggi</h1>
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Aggiungi
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <Users className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <div>
            <h3 className="font-medium">Nessun personaggio ancora</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Crea il tuo primo personaggio per iniziare a popolare il mondo.
            </p>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((char: Character) => {
            const status = statusIndicators[char.status] ?? statusIndicators.UNKNOWN;
            return (
              <div
                key={char.id}
                className="group relative rounded-lg border p-4 dark:border-gray-800"
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(char.id, char.name)}
                  className="absolute right-3 top-3 rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Name */}
                <h3 className="pr-8 font-semibold">{char.name}</h3>

                {/* Role badge */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeColors[char.role] ?? roleBadgeColors.SUPPORTING}`}
                  >
                    {roleLabels[char.role] ?? char.role}
                  </span>

                  {/* Status indicator */}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className={`inline-block h-2 w-2 rounded-full ${status.color}`} />
                    {status.label}
                  </span>

                  {/* Age */}
                  {char.age != null && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {char.age} anni
                    </span>
                  )}
                </div>

                {/* Personality snippet */}
                {char.personality && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {char.personality}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuovo Personaggio</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="rounded p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Nome del personaggio"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1 block text-sm font-medium">Ruolo</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="mb-1 block text-sm font-medium">Eta</label>
                <input
                  type="number"
                  min={0}
                  value={formAge}
                  onChange={(e) => setFormAge(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Eta del personaggio"
                />
              </div>

              {/* Personality */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Personalita
                </label>
                <textarea
                  value={formPersonality}
                  onChange={(e) => setFormPersonality(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Descrivi la personalita..."
                />
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

export function CharactersContent() {
  return (
    <ProjectSelector>
      {(projectId) => <CharactersInner projectId={projectId} />}
    </ProjectSelector>
  );
}
