import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  X,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingFaq } from "@/components/landing/pricing-faq";

export const metadata: Metadata = {
  title: "Prezzi",
  description:
    "Scegli il piano NeoByteWriter perfetto per te. Inizia gratis, passa a un piano avanzato quando sei pronto.",
};

/* -------------------------------------------------------------------------- */
/*  DATA                                                                      */
/* -------------------------------------------------------------------------- */

const plans = [
  {
    name: "Free",
    price: "0",
    period: "per sempre",
    description: "Perfetto per iniziare a scrivere e provare la piattaforma",
    features: [
      "2 progetti attivi",
      "15 generazioni AI al giorno",
      "Editor base con auto-save",
      "Export in Markdown",
      "Worldbuilding base (personaggi e luoghi)",
      "Supporto community",
    ],
    cta: "Inizia gratis",
    href: "/auth/sign-up",
    highlighted: false,
  },
  {
    name: "Writer",
    price: "9.99",
    period: "al mese",
    description: "Per scrittori che fanno sul serio e vogliono strumenti completi",
    features: [
      "10 progetti attivi",
      "150 generazioni AI al giorno",
      "Editor avanzato completo",
      "Export DOCX e Markdown",
      "Worldbuilding completo",
      "Analisi coerenza avanzata",
      "Calendario di scrittura",
      "Statistiche dettagliate",
      "Supporto prioritario via email",
    ],
    cta: "Prova Writer gratis",
    href: "/auth/sign-up?plan=writer",
    highlighted: true,
  },
  {
    name: "Professional",
    price: "19.99",
    period: "al mese",
    description:
      "Per professionisti, autori prolifici e chi vuole il massimo",
    features: [
      "Progetti illimitati",
      "AI illimitata",
      "Tutte le funzionalit\u00E0 Writer",
      "Export professionale completo",
      "Bibbia del mondo esportabile",
      "Analisi stilistica avanzata",
      "API access per integrazioni",
      "Backup prioritario",
      "Supporto dedicato 24/7",
    ],
    cta: "Scegli Professional",
    href: "/auth/sign-up?plan=professional",
    highlighted: false,
  },
] as const;

type FeatureRow = {
  name: string;
  free: string | boolean;
  writer: string | boolean;
  professional: string | boolean;
};

const comparisonFeatures: FeatureRow[] = [
  {
    name: "Progetti attivi",
    free: "2",
    writer: "10",
    professional: "Illimitati",
  },
  {
    name: "Generazioni AI",
    free: "15/giorno",
    writer: "150/giorno",
    professional: "Illimitate",
  },
  { name: "Editor base", free: true, writer: true, professional: true },
  {
    name: "Editor avanzato (formattazione, versioning)",
    free: false,
    writer: true,
    professional: true,
  },
  { name: "Auto-save", free: true, writer: true, professional: true },
  { name: "Export Markdown", free: true, writer: true, professional: true },
  { name: "Export DOCX", free: false, writer: true, professional: true },
  {
    name: "Bibbia del mondo esportabile",
    free: false,
    writer: false,
    professional: true,
  },
  {
    name: "Worldbuilding base",
    free: true,
    writer: true,
    professional: true,
  },
  {
    name: "Worldbuilding completo (fazioni, timeline)",
    free: false,
    writer: true,
    professional: true,
  },
  {
    name: "Analisi coerenza",
    free: false,
    writer: true,
    professional: true,
  },
  {
    name: "Analisi stilistica avanzata",
    free: false,
    writer: false,
    professional: true,
  },
  {
    name: "Calendario di scrittura",
    free: false,
    writer: true,
    professional: true,
  },
  {
    name: "Statistiche dettagliate",
    free: false,
    writer: true,
    professional: true,
  },
  { name: "API access", free: false, writer: false, professional: true },
  {
    name: "Supporto",
    free: "Community",
    writer: "Email prioritaria",
    professional: "Dedicato 24/7",
  },
];

/* -------------------------------------------------------------------------- */
/*  HELPER                                                                    */
/* -------------------------------------------------------------------------- */

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto size-4 text-primary" />
  ) : (
    <X className="mx-auto size-4 text-muted-foreground/40" />
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="size-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              NeoByteWriter
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/sign-in">Accedi</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Inizia gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Prezzi trasparenti
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Scegli il piano giusto per te
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Inizia gratis con tutte le funzionalit&agrave; base. Passa a un
              piano a pagamento quando sei pronto per sbloccare tutto il
              potenziale di NeoByteWriter.
            </p>
          </div>

          {/* Plan cards */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "relative border-primary shadow-lg ring-1 ring-primary"
                    : ""
                }
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1">Pi&ugrave; popolare</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">
                      {plan.price}&euro;
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Tutti i piani a pagamento includono 14 giorni di prova gratuita.
            Cancella in qualsiasi momento, senza vincoli.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="border-t bg-gray-50/50 dark:bg-gray-900/30">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Confronto dettagliato dei piani
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 pr-4 text-sm font-semibold">
                      Funzionalit&agrave;
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      Free
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      <span className="text-primary">Writer</span>
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      Professional
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row) => (
                    <tr
                      key={row.name}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="py-3.5 pr-4 text-sm">{row.name}</td>
                      <td className="px-4 py-3.5 text-center">
                        <CellValue value={row.free} />
                      </td>
                      <td className="bg-primary/5 px-4 py-3.5 text-center">
                        <CellValue value={row.writer} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <CellValue value={row.professional} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td className="py-6 pr-4" />
                    <td className="px-4 py-6 text-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/auth/sign-up">Inizia gratis</Link>
                      </Button>
                    </td>
                    <td className="bg-primary/5 px-4 py-6 text-center">
                      <Button size="sm" asChild>
                        <Link href="/auth/sign-up?plan=writer">
                          Prova Writer
                        </Link>
                      </Button>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/auth/sign-up?plan=professional">
                          Scegli Pro
                        </Link>
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="border-t">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Domande frequenti sui prezzi
            </h2>
            <PricingFaq />
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-gray-50/50 dark:bg-gray-900/30">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Pronto a iniziare?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Crea il tuo account gratuito e inizia a scrivere in meno di un
              minuto.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Inizia gratis
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/">Torna alla home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <span className="font-bold">NeoByteWriter</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} NeoByteStudios. Tutti i diritti
              riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
