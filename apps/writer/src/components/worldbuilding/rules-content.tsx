"use client";

import { useState } from "react";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import {
  useWorldRules,
  useCreateWorldRule,
  useDeleteWorldRule,
} from "@/hooks/use-world-rules";
import type { WorldRule } from "@/hooks/use-world-rules";
import { Loader2, Plus, ScrollText, Trash2, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// --- Inner content component ---

function RulesInner({ projectId }: { projectId: string }) {
  const { data, isLoading } = useWorldRules(projectId);
  const createMutation = useCreateWorldRule();
  const deleteMutation = useDeleteWorldRule();

  const [showDialog, setShowDialog] = useState(false);
  const [formRule, setFormRule] = useState("");
  const [formExplanation, setFormExplanation] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formIsStrict, setFormIsStrict] = useState(false);

  const items = data?.items ?? [];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formRule.trim()) return;

    try {
      await createMutation.mutateAsync({
        projectId,
        rule: formRule.trim(),
        explanation: formExplanation.trim() || undefined,
        category: formCategory.trim() || undefined,
        isStrict: formIsStrict,
      });
      toast.success("Regola creata con successo");
      setShowDialog(false);
      setFormRule("");
      setFormExplanation("");
      setFormCategory("");
      setFormIsStrict(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminare questa regola?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Regola eliminata");
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
        <h1 className="text-2xl font-bold">Regole del Mondo</h1>
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
          <ScrollText className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <div>
            <h3 className="font-medium">Nessuna regola ancora</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Definisci le leggi fondamentali che governano il tuo mondo.
            </p>
          </div>
        </div>
      )}

      {/* List view */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((rule: WorldRule) => (
            <div
              key={rule.id}
              className="group flex items-start gap-3 rounded-lg border p-4 dark:border-gray-800"
            >
              {/* Strict indicator */}
              <div className="mt-0.5 flex-shrink-0">
                {rule.isStrict ? (
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                ) : (
                  <div className="h-5 w-5" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{rule.rule}</p>
                {rule.explanation && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {rule.explanation}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {rule.category && (
                    <span className="inline-block rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
                      {rule.category}
                    </span>
                  )}
                  {rule.isStrict && (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      Regola Rigida
                    </span>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(rule.id)}
                className="flex-shrink-0 rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuova Regola</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="rounded p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Rule */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Regola <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formRule}
                  onChange={(e) => setFormRule(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Scrivi la regola del mondo..."
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Spiegazione
                </label>
                <textarea
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Spiega come funziona questa regola..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="es. Fisica, Magia, Sociale..."
                />
              </div>

              {/* Is Strict */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isStrict"
                  checked={formIsStrict}
                  onChange={(e) => setFormIsStrict(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="isStrict" className="text-sm font-medium">
                  Regola rigida (non puo essere infranta)
                </label>
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

export function RulesContent() {
  return (
    <ProjectSelector>
      {(projectId) => <RulesInner projectId={projectId} />}
    </ProjectSelector>
  );
}
