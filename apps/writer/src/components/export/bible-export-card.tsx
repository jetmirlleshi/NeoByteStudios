"use client";

import { useState } from "react";
import {
  BookMarked,
  FileCode,
  FileJson,
  Loader2,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBibleExport } from "@/hooks/use-export";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BibleExportCardProps {
  projectId: string;
}

// ---------------------------------------------------------------------------
// Section options
// ---------------------------------------------------------------------------

interface SectionOption {
  id: string;
  label: string;
}

const BIBLE_SECTIONS: SectionOption[] = [
  { id: "characters", label: "Personaggi" },
  { id: "locations", label: "Luoghi" },
  { id: "items", label: "Oggetti" },
  { id: "factions", label: "Fazioni" },
  { id: "magicSystem", label: "Sistema magico" },
  { id: "worldRules", label: "Regole del mondo" },
  { id: "timeline", label: "Cronologia" },
  { id: "subplots", label: "Sottotrame" },
  { id: "relationships", label: "Relazioni" },
];

// ---------------------------------------------------------------------------
// Format options
// ---------------------------------------------------------------------------

type BibleFormat = "json" | "markdown";

const FORMAT_OPTIONS: {
  id: BibleFormat;
  label: string;
  description: string;
  icon: typeof FileJson;
}[] = [
  {
    id: "json",
    label: "JSON",
    description: "Dati strutturati, ideale per importazione in altri strumenti",
    icon: FileJson,
  },
  {
    id: "markdown",
    label: "Markdown",
    description: "Documento leggibile, ottimo per consultazione",
    icon: FileCode,
  },
];

// ---------------------------------------------------------------------------
// Checkbox helper
// ---------------------------------------------------------------------------

function Checkbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
      />
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BibleExportCard({ projectId }: BibleExportCardProps) {
  const { mutate, isPending } = useBibleExport();

  const [format, setFormat] = useState<BibleFormat>("markdown");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    () => new Set(BIBLE_SECTIONS.map((s) => s.id))
  );

  const toggleSection = (sectionId: string, checked: boolean) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(sectionId);
      } else {
        next.delete(sectionId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedSections.size === BIBLE_SECTIONS.length) {
      setSelectedSections(new Set());
    } else {
      setSelectedSections(new Set(BIBLE_SECTIONS.map((s) => s.id)));
    }
  };

  const handleExport = () => {
    mutate({
      projectId,
      format,
      sections: Array.from(selectedSections),
    });
  };

  const allSelected = selectedSections.size === BIBLE_SECTIONS.length;
  const noneSelected = selectedSections.size === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookMarked className="h-4 w-4" />
          Esporta bibbia del worldbuilding
        </CardTitle>
        <CardDescription>
          Esporta la bibbia della tua storia con tutte le informazioni sul mondo
          narrativo.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Section selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Sezioni da includere
            </p>
            <button
              onClick={toggleAll}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {allSelected ? "Deseleziona tutto" : "Seleziona tutto"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BIBLE_SECTIONS.map(({ id, label }) => (
              <Checkbox
                key={id}
                id={`bible-section-${id}`}
                label={label}
                checked={selectedSections.has(id)}
                onChange={(checked) => toggleSection(id, checked)}
              />
            ))}
          </div>
        </div>

        {/* Format selection */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Formato
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {FORMAT_OPTIONS.map(({ id, label, description, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFormat(id)}
                disabled={isPending}
                className={`flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors ${
                  format === id
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:border-blue-400 dark:bg-blue-950/30 dark:ring-blue-400"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                  {format === id && (
                    <Check className="ml-auto h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleExport}
          disabled={isPending || noneSelected}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Esportazione in corso...
            </>
          ) : (
            <>
              <BookMarked className="mr-2 h-4 w-4" />
              Esporta bibbia
            </>
          )}
        </Button>
        {noneSelected && (
          <p className="mt-2 w-full text-center text-xs text-red-500 dark:text-red-400">
            Seleziona almeno una sezione per esportare.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
