"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DIVISIONS } from "@/lib/constants";

// ─── Diagram Node Data ──────────────────────────────────────────
// Positions for the 4 pillar nodes arranged in a diamond pattern
// around the central "IP" hub. Values are percentages of the
// container so the layout stays responsive.
const NODE_POSITIONS: Record<string, { top: string; left: string }> = {
  writer: { top: "8%", left: "50%" },   // top
  forge: { top: "50%", left: "92%" },   // right
  games: { top: "92%", left: "50%" },   // bottom
  vision: { top: "50%", left: "8%" },   // left
};

// ─── SVG Line Endpoints ─────────────────────────────────────────
// Matching coordinates (in the 200x200 SVG viewBox) so the
// connecting lines point from the centre to each node.
const LINE_ENDPOINTS: Record<string, { x: number; y: number }> = {
  writer: { x: 100, y: 22 },
  forge: { x: 178, y: 100 },
  games: { x: 100, y: 178 },
  vision: { x: 22, y: 100 },
};

// ─── Subtle floating animation for each node ───────────────────
const floatVariants = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    transition: {
      duration: 3 + i * 0.4,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  }),
};

// ─── Pulse animation for connecting lines ───────────────────────
const pulseVariants = {
  animate: (i: number) => ({
    opacity: [0.25, 0.6, 0.25],
    transition: {
      duration: 2.5 + i * 0.3,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  }),
};

// ─── Central hub glow animation ─────────────────────────────────
const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px 4px rgba(124, 58, 237, 0.3), 0 0 40px 8px rgba(59, 130, 246, 0.15)",
      "0 0 28px 8px rgba(124, 58, 237, 0.45), 0 0 56px 12px rgba(59, 130, 246, 0.25)",
      "0 0 20px 4px rgba(124, 58, 237, 0.3), 0 0 40px 8px rgba(59, 130, 246, 0.15)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  },
};

export default function PillarDiagram() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md min-h-[300px]">
      {/* SVG connecting lines (behind everything) */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {DIVISIONS.map((division, i) => {
          const end = LINE_ENDPOINTS[division.slug];
          return (
            <motion.line
              key={division.slug}
              x1="100"
              y1="100"
              x2={end.x}
              y2={end.y}
              stroke={division.color}
              strokeWidth="0.8"
              strokeLinecap="round"
              initial={{ opacity: prefersReducedMotion ? 0.5 : 0.25 }}
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
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-brand-to"
          variants={prefersReducedMotion ? undefined : glowVariants}
          animate={prefersReducedMotion ? undefined : "animate"}
        >
          <span className="text-lg font-bold text-white select-none">
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
            {/* Node circle */}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-bg-secondary"
              style={{ borderColor: division.color }}
            >
              <span className="text-base leading-none select-none" role="img" aria-label={division.name}>
                {division.icon}
              </span>
            </div>
            {/* Division label */}
            <span
              className="mt-1.5 text-xs font-medium"
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
