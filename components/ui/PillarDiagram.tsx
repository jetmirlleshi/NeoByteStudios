"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DIVISIONS } from "@/lib/constants";
import DivisionIcon from "@/components/ui/DivisionIcon";

const NODE_POSITIONS: Record<string, { top: string; left: string }> = {
  writer: { top: "6%", left: "50%" },
  forge: { top: "50%", left: "94%" },
  games: { top: "94%", left: "50%" },
  vision: { top: "50%", left: "6%" },
};

const LINE_ENDPOINTS: Record<string, { x: number; y: number }> = {
  writer: { x: 100, y: 20 },
  forge: { x: 180, y: 100 },
  games: { x: 100, y: 180 },
  vision: { x: 20, y: 100 },
};

const floatVariants = {
  animate: (i: number) => ({
    y: [0, -8, 0],
    transition: {
      duration: 3 + i * 0.4,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  }),
};

const pulseVariants = {
  animate: (i: number) => ({
    opacity: [0.2, 0.6, 0.2],
    transition: {
      duration: 2.5 + i * 0.3,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  }),
};

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 24px 6px rgba(124, 58, 237, 0.3), 0 0 48px 10px rgba(6, 214, 160, 0.15)",
      "0 0 36px 12px rgba(124, 58, 237, 0.5), 0 0 64px 16px rgba(6, 214, 160, 0.3)",
      "0 0 24px 6px rgba(124, 58, 237, 0.3), 0 0 48px 10px rgba(6, 214, 160, 0.15)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  },
};

const nodeGlowVariants = {
  animate: (color: string) => ({
    boxShadow: [
      `0 0 12px 2px ${color}30, 0 0 24px 4px ${color}15`,
      `0 0 20px 6px ${color}45, 0 0 36px 8px ${color}25`,
      `0 0 12px 2px ${color}30, 0 0 24px 4px ${color}15`,
    ],
    transition: {
      duration: 2.8,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  }),
};

export default function PillarDiagram() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md min-h-[320px]">
      {/* Ambient glow behind diagram */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-[#7c3aed]/5 to-[#06d6a0]/5 blur-3xl" />

      {/* SVG connecting lines */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          {DIVISIONS.map((division) => (
            <linearGradient
              key={`grad-${division.slug}`}
              id={`line-grad-${division.slug}`}
              x1="50%"
              y1="50%"
              x2={LINE_ENDPOINTS[division.slug].x > 100 ? "100%" : "0%"}
              y2={LINE_ENDPOINTS[division.slug].y > 100 ? "100%" : "0%"}
            >
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="100%" stopColor={division.color} stopOpacity="0.8" />
            </linearGradient>
          ))}
        </defs>

        {/* Cross-connections (subtle) */}
        {DIVISIONS.map((d1, i) =>
          DIVISIONS.slice(i + 1).map((d2) => {
            const p1 = LINE_ENDPOINTS[d1.slug];
            const p2 = LINE_ENDPOINTS[d2.slug];
            return (
              <motion.line
                key={`${d1.slug}-${d2.slug}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="url(#line-grad-writer)"
                strokeWidth="0.3"
                strokeDasharray="2 4"
                initial={{ opacity: prefersReducedMotion ? 0.1 : 0.05 }}
                variants={
                  prefersReducedMotion
                    ? undefined
                    : {
                        animate: {
                          opacity: [0.05, 0.15, 0.05],
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "mirror" as const,
                            ease: "easeInOut" as const,
                          },
                        },
                      }
                }
                animate={prefersReducedMotion ? undefined : "animate"}
              />
            );
          })
        )}

        {/* Main lines to center */}
        {DIVISIONS.map((division, i) => {
          const end = LINE_ENDPOINTS[division.slug];
          return (
            <motion.line
              key={division.slug}
              x1="100"
              y1="100"
              x2={end.x}
              y2={end.y}
              stroke={`url(#line-grad-${division.slug})`}
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ opacity: prefersReducedMotion ? 0.5 : 0.3 }}
              variants={prefersReducedMotion ? undefined : pulseVariants}
              animate={prefersReducedMotion ? undefined : "animate"}
              custom={i}
            />
          );
        })}
      </svg>

      {/* Central "IP" hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-accent"
          variants={prefersReducedMotion ? undefined : glowVariants}
          animate={prefersReducedMotion ? undefined : "animate"}
        >
          <span className="font-display text-xl font-bold text-white select-none tracking-wide">
            IP
          </span>
        </motion.div>
      </div>

      {/* 4 orbiting pillar nodes */}
      {DIVISIONS.map((division, i) => {
        const pos = NODE_POSITIONS[division.slug];
        return (
          <motion.div
            key={division.slug}
            className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
            variants={prefersReducedMotion ? undefined : floatVariants}
            animate={prefersReducedMotion ? undefined : "animate"}
            custom={i}
          >
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 bg-bg-secondary/80 backdrop-blur-sm"
              style={{ borderColor: division.color }}
              variants={prefersReducedMotion ? undefined : nodeGlowVariants}
              animate={prefersReducedMotion ? undefined : "animate"}
              custom={division.color}
            >
              <DivisionIcon
                slug={division.slug}
                color={division.color}
                size={22}
              />
            </motion.div>
            <span
              className="mt-2 text-xs font-semibold font-display tracking-wide"
              style={{ color: division.color }}
            >
              {division.name.replace("NeoByte", "")}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
