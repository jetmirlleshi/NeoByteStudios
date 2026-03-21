"use client";

import { useState } from "react";
import {
  Wand2,
  MessageSquare,
  Image,
  Swords,
  ArrowRightLeft,
  Clock,
  Loader2,
  Check,
  X,
  Square,
} from "lucide-react";
import { useAIGeneration } from "@/hooks/use-ai-generation";

// ---------------------------------------------------------------------------
// Generation types configuration
// ---------------------------------------------------------------------------

const GENERATION_TYPES = [
  { id: "continue", label: "Continua", icon: Wand2 },
  { id: "dialogue", label: "Dialogo", icon: MessageSquare },
  { id: "description", label: "Descrizione", icon: Image },
  { id: "action", label: "Azione", icon: Swords },
  { id: "transition", label: "Transizione", icon: ArrowRightLeft },
  { id: "flashback", label: "Flashback", icon: Clock },
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AIGeneratePanelProps {
  projectId: string;
  chapterId: string;
  recentText: string;
  onAccept?: (text: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AIGeneratePanel({
  projectId,
  chapterId,
  recentText,
  onAccept,
}: AIGeneratePanelProps) {
  const {
    generate,
    cancel,
    isGenerating,
    generatedText,
    acceptText,
    discardText,
  } = useAIGeneration();

  const [selectedType, setSelectedType] = useState("continue");
  const [instruction, setInstruction] = useState("");

  const hasResult = generatedText.length > 0 && !isGenerating;

  // --- Handlers ---

  const handleGenerate = async () => {
    try {
      await generate({
        projectId,
        chapterId,
        type: selectedType,
        recentText,
        instruction: instruction.trim() || undefined,
      });
    } catch {
      // Error already handled in the hook
    }
  };

  const handleAccept = () => {
    const text = acceptText();
    onAccept?.(text);
  };

  const handleDiscard = () => {
    discardText();
  };

  // --- Render ---

  return (
    <div className="flex flex-col gap-4">
      {/* Section title */}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Genera testo
      </h3>

      {/* Generation type selector */}
      <div className="grid grid-cols-3 gap-2">
        {GENERATION_TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedType(id)}
            disabled={isGenerating}
            className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
              selectedType === id
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Instruction textarea (optional) */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
          Istruzioni aggiuntive (opzionale)
        </label>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Es: Aggiungi tensione tra i personaggi..."
          disabled={isGenerating}
          rows={3}
          className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
        />
      </div>

      {/* Generate / Cancel button */}
      {isGenerating ? (
        <button
          onClick={cancel}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <Square className="h-4 w-4" />
          Interrompi
        </button>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={!recentText.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <Wand2 className="h-4 w-4" />
          Genera
        </button>
      )}

      {/* Streaming text preview */}
      {(isGenerating || generatedText) && (
        <div className="rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            {isGenerating && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Generazione in corso...
              </>
            )}
            {hasResult && "Anteprima testo generato"}
          </div>

          <div className="max-h-60 overflow-y-auto">
            <p className="whitespace-pre-wrap font-mono text-sm italic leading-relaxed text-gray-700 dark:text-gray-300">
              {generatedText || (
                <span className="text-gray-400">In attesa...</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Accept / Discard buttons */}
      {hasResult && (
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            Accetta
          </button>
          <button
            onClick={handleDiscard}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Scarta
          </button>
        </div>
      )}
    </div>
  );
}
