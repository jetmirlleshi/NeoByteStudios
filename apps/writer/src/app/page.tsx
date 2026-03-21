import Link from "next/link";
import {
  PenLine,
  Globe,
  Sparkles,
  BarChart3,
  FileDown,
  Shield,
  Check,
  ArrowRight,
  BookOpen,
  Menu,
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
import { Input } from "@/components/ui/input";
import { LandingFaq } from "@/components/landing/landing-faq";
import { MobileNav } from "@/components/landing/mobile-nav";

/* -------------------------------------------------------------------------- */
/*  DATA                                                                      */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: PenLine,
    title: "Editor Avanzato",
    description:
      "Editor professionale con auto-save, versioning e formattazione avanzata per concentrarti sulla scrittura.",
  },
  {
    icon: Globe,
    title: "Worldbuilding",
    description:
      "Gestisci personaggi, luoghi, fazioni e la bibbia del tuo mondo in un unico posto organizzato.",
  },
  {
    icon: Sparkles,
    title: "Assistente AI",
    description:
      "Generazione testo, suggerimenti stilistici e controllo coerenza con intelligenza artificiale.",
  },
  {
    icon: BarChart3,
    title: "Analisi Testo",
    description:
      "Statistiche dettagliate, calendario di scrittura e analisi approfondita della prosa.",
  },
  {
    icon: FileDown,
    title: "Export Professionale",
    description:
      "Esporta in DOCX, Markdown o come bibbia del mondo, pronto per editori e agenti.",
  },
  {
    icon: Shield,
    title: "Collaborazione Sicura",
    description:
      "I tuoi dati sono protetti con crittografia e backup automatico. La tua storia resta tua.",
  },
] as const;

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfetto per iniziare a scrivere",
    features: [
      "2 progetti attivi",
      "15 generazioni AI al giorno",
      "Editor base con auto-save",
      "Export in Markdown",
      "Supporto community",
    ],
    cta: "Inizia gratis",
    href: "/auth/sign-up",
    highlighted: false,
  },
  {
    name: "Writer",
    price: "9.99",
    description: "Per scrittori che fanno sul serio",
    features: [
      "10 progetti attivi",
      "150 generazioni AI al giorno",
      "Editor avanzato completo",
      "Export DOCX e Markdown",
      "Worldbuilding completo",
      "Analisi coerenza avanzata",
      "Supporto prioritario",
    ],
    cta: "Prova Writer",
    href: "/auth/sign-up?plan=writer",
    highlighted: true,
  },
  {
    name: "Professional",
    price: "19.99",
    description: "Per professionisti e autori prolifici",
    features: [
      "Progetti illimitati",
      "AI illimitata",
      "Tutte le funzionalit\u00E0",
      "Export professionale completo",
      "Bibbia del mondo esportabile",
      "Analisi stilistica avanzata",
      "API access",
      "Supporto dedicato 24/7",
    ],
    cta: "Scegli Professional",
    href: "/auth/sign-up?plan=professional",
    highlighted: false,
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ------------------------------------------------------------------ */}
      {/*  HEADER / NAV                                                      */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="size-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              NeoByteWriter
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#funzionalita"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Funzionalit&agrave;
            </a>
            <a
              href="#prezzi"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Prezzi
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/auth/sign-in">Accedi</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">
                Inizia gratis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile nav */}
          <MobileNav />
        </div>
      </header>

      <main className="flex-1">
        {/* ---------------------------------------------------------------- */}
        {/*  HERO                                                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-3xl" />
            <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-primary/8 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                Potenziato dall&apos;intelligenza artificiale
              </Badge>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Scrivi il tuo romanzo con{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  l&apos;AI al tuo fianco
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                L&apos;editor di scrittura creativa che combina strumenti
                professionali, worldbuilding e intelligenza artificiale per
                aiutarti a dare vita alla tua storia.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/auth/sign-up">
                    Inizia a scrivere gratis
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a href="#funzionalita">Scopri le funzionalit&agrave;</a>
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Nessuna carta di credito richiesta. Inizia in 30 secondi.
              </p>
            </div>

            {/* Hero visual placeholder */}
            <div className="mx-auto mt-16 max-w-4xl">
              <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-2xl dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
                <div className="aspect-video p-6 sm:p-10">
                  {/* Simulated editor UI */}
                  <div className="flex h-full flex-col gap-4 rounded-lg border bg-white/50 p-4 dark:bg-gray-900/50">
                    {/* Toolbar mock */}
                    <div className="flex items-center gap-2 border-b pb-3">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <div className="ml-4 h-5 w-24 rounded bg-muted" />
                      <div className="h-5 w-16 rounded bg-muted" />
                      <div className="h-5 w-20 rounded bg-muted" />
                    </div>
                    {/* Content mock */}
                    <div className="flex flex-1 gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-3/4 rounded bg-muted/70" />
                        <div className="h-4 w-full rounded bg-muted/50" />
                        <div className="h-4 w-5/6 rounded bg-muted/50" />
                        <div className="h-4 w-full rounded bg-muted/50" />
                        <div className="h-4 w-2/3 rounded bg-muted/50" />
                        <div className="mt-4 h-5 w-1/2 rounded bg-muted/70" />
                        <div className="h-4 w-full rounded bg-muted/50" />
                        <div className="h-4 w-4/5 rounded bg-muted/50" />
                      </div>
                      {/* Sidebar mock */}
                      <div className="hidden w-48 space-y-3 rounded-lg border p-3 sm:block">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-primary" />
                          <div className="h-4 w-20 rounded bg-primary/20" />
                        </div>
                        <div className="h-3 w-full rounded bg-muted/50" />
                        <div className="h-3 w-4/5 rounded bg-muted/50" />
                        <div className="h-3 w-full rounded bg-muted/50" />
                        <div className="mt-2 h-7 w-full rounded bg-primary/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  FEATURES                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="funzionalita"
          className="border-t bg-gray-50/50 dark:bg-gray-900/30"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Funzionalit&agrave;
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tutto ci&ograve; che serve per scrivere il tuo capolavoro
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Strumenti professionali pensati per scrittori, potenziati
                dall&apos;intelligenza artificiale.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  PRICING                                                         */}
        {/* ---------------------------------------------------------------- */}
        <section id="prezzi" className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Prezzi
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Scegli il piano giusto per te
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Inizia gratis, passa a un piano a pagamento quando sei pronto.
                Nessun vincolo.
              </p>
            </div>

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
                      <span className="text-muted-foreground">/mese</span>
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
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Tutti i piani includono 14 giorni di prova gratuita. Cancella in
              qualsiasi momento.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  FAQ                                                             */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="faq"
          className="border-t bg-gray-50/50 dark:bg-gray-900/30"
        >
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Domande frequenti
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tutto quello che devi sapere su NeoByteWriter.
              </p>
            </div>

            <div className="mt-12">
              <LandingFaq />
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/*  FOOTER                                                            */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <span className="font-bold">NeoByteWriter</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Lo strumento AI per scrittori di fiction. Scrivi, organizza ed
                esporta il tuo romanzo con facilit&agrave;.
              </p>
            </div>

            {/* Prodotto */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Prodotto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#funzionalita"
                    className="transition-colors hover:text-foreground"
                  >
                    Funzionalit&agrave;
                  </a>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="transition-colors hover:text-foreground"
                  >
                    Prezzi
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="transition-colors hover:text-foreground"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legale */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Legale</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="transition-colors hover:text-foreground"
                  >
                    Termini di Servizio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Newsletter</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Ricevi aggiornamenti su nuove funzionalit&agrave; e consigli di
                scrittura.
              </p>
              <form className="flex gap-2" action="/api/newsletter" method="POST">
                <Input
                  type="email"
                  name="email"
                  placeholder="la-tua@email.it"
                  required
                  className="flex-1"
                />
                <Button type="submit" size="default">
                  Iscriviti
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-10 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} NeoByteStudios. Tutti i diritti
              riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
