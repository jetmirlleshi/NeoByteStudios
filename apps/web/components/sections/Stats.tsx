"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { STATS } from "@/lib/constants";
import { Users, Layers, Globe, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map iconName strings from constants to actual icon components
const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Layers,
  Globe,
  Zap,
};

function AnimatedCounter({
  target,
  suffix,
  shouldAnimate,
}: {
  target: number;
  suffix: string;
  shouldAnimate: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const stepTime = 16; // roughly 60fps
    const totalSteps = Math.ceil(duration / stepTime);
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, shouldAnimate]);

  return (
    <span className="gradient-text font-display text-4xl font-bold md:text-5xl">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
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
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <section
      ref={sectionRef}
      className="section-glow-violet mesh-pattern relative py-20 md:py-28"
      aria-label="Studio statistics"
    >
      <div className="relative mx-auto max-w-6xl px-4">
        {/* ── Section Header ─────────────────────────────────── */}
        <div className="mb-16 text-center">
          <h2 className="gradient-text font-display text-3xl font-bold md:text-4xl">
            The One-Person Studio Model
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-text-secondary">
            Proof that one creator with AI can build at studio scale.
          </p>
        </div>

        {/* ── Stats Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = ICON_MAP[stat.iconName];

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border-custom bg-bg-card/80 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:border-brand-from/30 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.15)]"
                style={{
                  animationDelay: `${stat.delay}ms`,
                }}
              >
                {/* Icon container with colored gradient background */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    {Icon && <Icon className="h-6 w-6 text-white" />}
                  </div>
                </div>

                {/* Animated counter */}
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  shouldAnimate={isVisible}
                />

                {/* Label */}
                <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
