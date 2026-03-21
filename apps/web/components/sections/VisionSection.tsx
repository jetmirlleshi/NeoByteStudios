"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { VISION_CARDS } from "@/lib/constants";
import { Lightbulb, Layers, Cpu, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

// Map iconName strings from constants to actual icon components
const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Layers,
  Cpu,
};

// Division data for the ecosystem diagram
const ECOSYSTEM_DIVISIONS = [
  { name: "Writer", emoji: "\u270D\uFE0F", color: "from-violet-500 to-violet-600" },
  { name: "Forge", emoji: "\u2692\uFE0F", color: "from-blue-500 to-blue-600" },
  { name: "Games", emoji: "\uD83C\uDFAE", color: "from-emerald-500 to-emerald-600" },
  { name: "Vision", emoji: "\uD83D\uDC41\uFE0F", color: "from-amber-500 to-orange-600" },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    []
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return { ref, isVisible };
}

export default function VisionSection() {
  const quoteReveal = useScrollReveal();
  const cardsReveal = useScrollReveal();
  const diagramReveal = useScrollReveal();

  return (
    <section
      id="vision"
      className="section-glow-mixed mesh-pattern relative overflow-hidden py-20 md:py-28"
      aria-label="Our vision"
    >
      {/* ── Blurred Decorative Circles ────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-from/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* ── Quote ──────────────────────────────────────────── */}
        <div
          ref={quoteReveal.ref}
          className="mb-16 text-center"
          style={{
            opacity: quoteReveal.isVisible ? 1 : 0,
            transform: quoteReveal.isVisible
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <blockquote className="mx-auto max-w-3xl">
            <p className="text-xl font-light italic leading-relaxed text-text-secondary md:text-2xl">
              &ldquo;AI doesn&apos;t replace creativity &mdash; it amplifies
              it.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-text-muted">
              &mdash; NeoByteStudios Manifesto
            </footer>
          </blockquote>
        </div>

        {/* ── Section Title ──────────────────────────────────── */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
            <span className="gradient-text">
              One Creator. Four Pillars. Infinite Worlds.
            </span>
          </h2>
        </div>

        {/* ── Vision Cards Grid ──────────────────────────────── */}
        <div
          ref={cardsReveal.ref}
          className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {VISION_CARDS.map((card, index) => {
            const Icon = ICON_MAP[card.iconName];

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-border-custom bg-bg-card p-6 transition-all duration-300 hover:border-brand-from/30 hover:shadow-lg"
                style={{
                  opacity: cardsReveal.isVisible ? 1 : 0,
                  transform: cardsReveal.isVisible
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: `opacity 0.6s ease-out ${card.delay}ms, transform 0.6s ease-out ${card.delay}ms`,
                }}
              >
                {/* Icon in colored container */}
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}
                >
                  {Icon && <Icon className="h-6 w-6 text-white" />}
                </div>

                {/* Title */}
                <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-text-secondary">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Ecosystem Diagram ──────────────────────────────── */}
        <div
          ref={diagramReveal.ref}
          className="flex flex-col items-center"
          style={{
            opacity: diagramReveal.isVisible ? 1 : 0,
            transform: diagramReveal.isVisible
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          {/* Central IP Hub */}
          <div className="relative mb-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-brand-to shadow-lg md:h-28 md:w-28">
              <span className="font-display text-2xl font-bold text-white md:text-3xl">
                IP
              </span>
            </div>
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-full animate-pulse-glow"
              style={{
                background:
                  "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Connecting lines (visual indicator) */}
          <div className="mb-4 h-8 w-[2px] bg-gradient-to-b from-brand-from to-brand-to" />

          {/* Division Cards */}
          <div className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
            {ECOSYSTEM_DIVISIONS.map((div) => (
              <div
                key={div.name}
                className="flex flex-col items-center rounded-xl border border-border-custom bg-bg-card p-4 text-center transition-all duration-300 hover:border-brand-from/30"
              >
                <span className="mb-2 text-2xl">{div.emoji}</span>
                <span className="text-sm font-semibold text-text-primary">
                  {div.name}
                </span>
              </div>
            ))}
          </div>

          {/* Output Label */}
          <div className="mt-6 mb-4 h-8 w-[2px] bg-gradient-to-b from-brand-to to-accent" />
          <span className="rounded-full border border-border-custom bg-bg-card px-4 py-2 text-sm font-medium text-text-secondary">
            Cross-Media Universe
          </span>

          {/* CTA Link */}
          <Link
            href="https://neobytewriter.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-from transition-colors hover:text-accent"
          >
            Start building your universe today
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
