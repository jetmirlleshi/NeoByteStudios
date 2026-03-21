"use client";

import { useState } from "react";
import {
  FileDown,
  FileText,
  FileCode,
  File,
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
import { useManuscriptExport } from "@/hooks/use-export";
import type { ManuscriptExportOptions } from "@/hooks/use-export";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ManuscriptExportCardProps {
  projectId: string;
}

// ---------------------------------------------------------------------------
// Format options
// ---------------------------------------------------------------------------

type ExportFormat = ManuscriptExportOptions["format"];

const FORMATS: {
  id: ExportFormat;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    id: "docx",
    label: "DOCX",
    description: "Formato Word, ideale per la revisione e la stampa",
    icon: FileText,
  },
  {
    id: "markdown",
    label: "Markdown",
    description: "Testo formattato, compatibile con molti editor",
    icon: FileCode,
  },
  {
    id: "text",
    label: "Testo semplice",
    description: "Solo testo, senza formattazione",
    icon: File,
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

export function ManuscriptExportCard({ projectId }: ManuscriptExportCardProps) {
  const { mutate, isPending } = useManuscriptExport();

  const [format, setFormat] = useState<ExportFormat>("docx");
  const [includeChapterNumbers, setIncludeChapterNumbers] = useState(true);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [pageBreak, setPageBreak] = useState(true);

  const handleExport = () => {
    mutate({
      projectId,
      format,
      options: {
        includeChapterNumbers,
        includeTitle,
        pageBreakBetweenChapters: pageBreak,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileDown className="h-4 w-4" />
          Esporta manoscritto
        </CardTitle>
        <CardDescription>
          Esporta il tuo manoscritto completo nel formato che preferisci.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Format selection */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Formato
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {FORMATS.map(({ id, label, description, icon: Icon }) => (
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

        {/* Export options */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Opzioni
          </p>
          <div className="space-y-2.5">
            <Checkbox
              id="include-title"
              label="Includi pagina titolo"
              checked={includeTitle}
              onChange={setIncludeTitle}
            />
            <Checkbox
              id="include-chapter-numbers"
              label="Includi numeri capitolo"
              checked={includeChapterNumbers}
              onChange={setIncludeChapterNumbers}
            />
            <Checkbox
              id="page-break"
              label="Interruzione pagina tra i capitoli"
              checked={pageBreak}
              onChange={setPageBreak}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleExport}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Esportazione in corso...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Esporta
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
