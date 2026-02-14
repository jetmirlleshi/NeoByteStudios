"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DIVISIONS } from "@/lib/constants";
import DivisionIcon from "@/components/ui/DivisionIcon";

const NODE_POSITIONS: Record<string, { top: string; left: string }> = {
  writer: { top: "8%", left: "50%" },
  forge: { top: "50%", left: "92%" },
  games: { top: "92%", left: "50%" },
  vision: { top: "50%", left: "8%" },
};

const LINE_ENDPOINTS: Record<string, { x: number; y: number }> = {
  writer: { x: 100, y: 22 },
  forge: { x: 178, y: 100 },
  games: { x: 100, y: 178 },
  vision: { x: 22, y: 100 },
};

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

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px 4px rgba(124, 58, 237, 0.3), 0 0 40px 8px rgba(6, 214, 160, 0.15)",
      "0 0 28px 8px rgba(124, 58, 237, 0.45), 0 0 56px 12px rgba(6, 214, 160, 0.25)",
      "0 0 20px 4px rgba(124, 58, 237, 0.3), 0 0 40px 8px rgba(6, 214, 160, 0.15)",
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
      {/* SVG connecting lines */}
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
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-accent"
          variants={prefersReducedMotion ? undefined : glowVariants}
          animate={prefersReducedMotion ? undefined : "animate"}
        >
          <span className="font-display text-lg font-bold text-white select-none">
            IP
          </span>
        </motion.div>
      </div>

      {/* 4 orbiting pillar nodes — now with SVG icons */}
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
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-bg-secondary"
              style={{ borderColor: division.color }}
            >
              <DivisionIcon slug={division.slug} color={division.color} size={18} />
            </div>
            <span
              className="mt-1.5 text-xs font-medium font-display"
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
