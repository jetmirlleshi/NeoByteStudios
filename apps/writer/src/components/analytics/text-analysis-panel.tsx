"use client";

import { useMemo } from "react";
import {
  FileText,
  MessageCircle,
  BookOpen,
  Hash,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTextAnalysis } from "@/hooks/use-analytics";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TextAnalysisPanelProps {
  projectId: string;
}

// ---------------------------------------------------------------------------
// Gulpease interpretation
// ---------------------------------------------------------------------------

function gulpeaseLabel(value: number): {
  label: string;
  color: string;
  description: string;
} {
  if (value >= 60) {
    return {
      label: "Facile",
      color: "text-green-600 dark:text-green-400",
      description: "Il testo è facilmente leggibile.",
    };
  }
  if (value >= 40) {
    return {
      label: "Medio",
      color: "text-amber-600 dark:text-amber-400",
      description: "Leggibilità adatta a un pubblico con istruzione media.",
    };
  }
  return {
    label: "Difficile",
    color: "text-red-600 dark:text-red-400",
    description: "Il testo può risultare complesso per molti lettori.",
  };
}

// ---------------------------------------------------------------------------
// Word cloud (simple weighted font sizes)
// ---------------------------------------------------------------------------

function WordCloud({ words }: { words: Array<{ word: string; count: number }> }) {
  const top20 = words.slice(0, 20);

  const maxCount = Math.max(1, ...top20.map((w) => w.count));
  const minCount = Math.min(...top20.map((w) => w.count));
  const range = Math.max(1, maxCount - minCount);

  // Map count to font size: 0.7rem to 1.6rem
  const minSize = 0.7;
  const maxSize = 1.6;

  // Color palette
  const colors = [
    "text-blue-600 dark:text-blue-400",
    "text-purple-600 dark:text-purple-400",
    "text-green-600 dark:text-green-400",
    "text-orange-600 dark:text-orange-400",
    "text-pink-600 dark:text-pink-400",
    "text-cyan-600 dark:text-cyan-400",
    "text-red-600 dark:text-red-400",
    "text-indigo-600 dark:text-indigo-400",
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-4">
      {top20.map((w, i) => {
        const normalized = (w.count - minCount) / range;
        const fontSize = minSize + normalized * (maxSize - minSize);
        const colorClass = colors[i % colors.length];

        return (
          <span
            key={w.word}
            className={`font-medium transition-opacity hover:opacity-70 ${colorClass}`}
            style={{ fontSize: `${fontSize}rem` }}
            title={`${w.word}: ${w.count.toLocaleString("it-IT")} occorrenze`}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat item helper
// ---------------------------------------------------------------------------

function StatItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border p-3 dark:border-gray-700">
      <span className="text-lg font-bold">
        {typeof value === "number" ? value.toLocaleString("it-IT") : value}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TextAnalysisPanel({ projectId }: TextAnalysisPanelProps) {
  const { data, isLoading } = useTextAnalysis(projectId);

  const gulpease = useMemo(
    () => (data ? gulpeaseLabel(data.gulpease) : null),
    [data]
  );

  // --- Loading state ---

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Analisi del testo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            Analisi in corso...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Analisi del testo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Nessun dato disponibile. Scrivi almeno un capitolo per vedere
            l&apos;analisi.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Word Cloud */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Hash className="h-4 w-4" />
            Parole più frequenti
          </CardTitle>
          <CardDescription>
            Le 20 parole più utilizzate nel tuo manoscritto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.topWords.length > 0 ? (
            <WordCloud words={data.topWords} />
          ) : (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Dati insufficienti per generare la nuvola di parole.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sentence Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Statistiche frasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatItem
              label="Media parole"
              value={data.sentenceStats.avg.toFixed(1)}
            />
            <StatItem
              label="Mediana parole"
              value={data.sentenceStats.median.toFixed(1)}
            />
            <StatItem label="Minimo" value={data.sentenceStats.min} />
            <StatItem label="Massimo" value={data.sentenceStats.max} />
          </div>

          {/* Distribution */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Distribuzione lunghezza frasi
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="w-16 justify-center">
                  Corte
                </Badge>
                <Progress
                  value={data.sentenceStats.distribution.short}
                  className="flex-1"
                />
                <span className="w-10 text-right text-xs text-gray-500">
                  {data.sentenceStats.distribution.short}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="w-16 justify-center">
                  Medie
                </Badge>
                <Progress
                  value={data.sentenceStats.distribution.medium}
                  className="flex-1"
                />
                <span className="w-10 text-right text-xs text-gray-500">
                  {data.sentenceStats.distribution.medium}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="w-16 justify-center">
                  Lunghe
                </Badge>
                <Progress
                  value={data.sentenceStats.distribution.long}
                  className="flex-1"
                />
                <span className="w-10 text-right text-xs text-gray-500">
                  {data.sentenceStats.distribution.long}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogue ratio + Gulpease + TTR */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Dialogue ratio */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4" />
              Rapporto dialoghi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">
                {(data.dialogueRatio * 100).toFixed(0)}%
              </span>
              <Progress value={data.dialogueRatio * 100} className="w-full" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                del testo totale è composto da dialoghi
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gulpease Index */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Indice Gulpease
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">
                {data.gulpease.toFixed(0)}
              </span>
              {gulpease && (
                <>
                  <Badge
                    variant="outline"
                    className={gulpease.color}
                  >
                    {gulpease.label}
                  </Badge>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {gulpease.description}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Type-Token Ratio */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Type-Token Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">
                {data.typeTokenRatio.toFixed(2)}
              </span>
              <Progress value={data.typeTokenRatio * 100} className="w-full" />
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                {data.typeTokenRatio >= 0.5
                  ? "Buona varietà lessicale"
                  : "Vocabolario ripetitivo — considera di variare le parole"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
