"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ROADMAP_ITEMS } from "@/lib/constants";
import type { RoadmapItem } from "@/lib/constants";
import {
  PenTool,
  Factory,
  Gamepad2,
  Eye,
  Rocket,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map iconName strings from constants to actual icon components
const ICON_MAP: Record<string, LucideIcon> = {
  PenTool,
  Factory,
  Gamepad2,
  Eye,
};

function StatusBadge({ status }: { status: RoadmapItem["status"] }) {
  const config = {
    active: {
      label: "Active",
      icon: CheckCircle2,
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    development: {
      label: "In Development",
      icon: Clock,
      className:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    planned: {
      label: "Planned",
      icon: Calendar,
      className:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function RoadmapCard({
  item,
  index,
}: {
  item: RoadmapItem;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
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
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const Icon = ICON_MAP[item.iconName];
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`relative flex items-center ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col md:gap-8`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {/* ── Timeline Dot ─────────────────────────────────────── */}
      <div className="absolute left-4 top-0 z-10 hidden h-full md:left-1/2 md:-translate-x-1/2 md:flex md:flex-col md:items-center">
        <div
          className={`h-4 w-4 rounded-full border-2 border-bg-primary bg-gradient-to-br ${item.color}`}
        />
      </div>

      {/* ── Card ─────────────────────────────────────────────── */}
      <div
        className={`w-full md:w-[calc(50%-2rem)] ${
          isLeft ? "md:pr-4" : "md:pl-4"
        }`}
      >
        <div className="rounded-2xl border border-border-custom bg-bg-card p-6 transition-all duration-300 hover:border-brand-from/30 hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.12)]">
          {/* Header: Icon + Status */}
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
            >
              {Icon && <Icon className="h-5 w-5 text-white" />}
            </div>
            <StatusBadge status={item.status} />
          </div>

          {/* Name (gradient text) */}
          <h3 className="gradient-text font-display text-xl font-bold">
            {item.name}
          </h3>

          {/* Tagline */}
          <p className="mt-1 text-sm text-text-secondary">{item.tagline}</p>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {item.description}
          </p>

          {/* Progress Bar (for non-active items) */}
          {item.status !== "active" && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-primary">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                  style={{ width: isVisible ? `${item.progress}%` : "0%" }}
                />
              </div>
              {item.expectedDate && (
                <p className="mt-2 text-xs text-text-muted">
                  Expected: {item.expectedDate}
                </p>
              )}
            </div>
          )}

          {/* Feature Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {item.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-border-custom bg-bg-secondary px-3 py-1 text-xs text-text-secondary"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Spacer for the other half on desktop ──────────── */}
      <div className="hidden w-[calc(50%-2rem)] md:block" />
    </div>
  );
}

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      className="section-glow-mixed mesh-pattern relative overflow-hidden py-20 md:py-28"
      aria-label="Product roadmap"
    >
      <div className="relative mx-auto max-w-5xl px-4">
        {/* ── Section Header ─────────────────────────────────── */}
        <div className="mb-16 text-center">
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-custom bg-bg-card/60 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-sm">
            <Rocket className="h-4 w-4 text-accent" />
            Our Journey
          </span>

          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            Building the Future of Creativity
          </h2>
        </div>

        {/* ── Timeline ───────────────────────────────────────── */}
        <div className="relative">
          {/* Center vertical line (visible on desktop) */}
          <div
            className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 md:block"
            style={{
              background:
                "linear-gradient(to bottom, #7c3aed, #10b981)",
            }}
          />

          {/* Cards */}
          <div className="space-y-12 md:space-y-16">
            {ROADMAP_ITEMS.map((item, index) => (
              <RoadmapCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
