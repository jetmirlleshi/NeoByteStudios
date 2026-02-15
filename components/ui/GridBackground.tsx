"use client";

import { useMemo } from "react";
import { seededRandom } from "@/lib/utils";

interface Dot {
  left: string;
  top: string;
  delay: number;
  duration: number;
  size: number;
}

function generateDots(count: number): Dot[] {
  const rand = seededRandom(42);
  const dots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      left: `${(Math.round(rand() * 20) / 20) * 100}%`,
      top: `${(Math.round(rand() * 20) / 20) * 100}%`,
      delay: rand() * 8,
      duration: 3 + rand() * 4,
      size: 2 + rand() * 2,
    });
  }
  return dots;
}

export default function GridBackground() {
  const dots = useMemo(() => generateDots(28), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Perspective grid -- tilted with rotateX for vanishing-point depth effect */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "70%",
          transformOrigin: "center bottom",
          animation:
            "grid-scroll 12s linear infinite, grid-pulse 8s ease-in-out infinite",
          /* willChange removed — CSS animation already promotes to compositor */
          backgroundImage: [
            `repeating-linear-gradient(90deg,color-mix(in srgb, var(--brand-from) 8%, transparent) 0px,color-mix(in srgb, var(--brand-from) 8%, transparent) 1px,transparent 1px,transparent 60px)`,
            `repeating-linear-gradient(0deg,color-mix(in srgb, var(--brand-to) 8%, transparent) 0px,color-mix(in srgb, var(--brand-to) 8%, transparent) 1px,transparent 1px,transparent 60px)`,
          ].join(","),
          backgroundSize: "60px 60px",
        }}
      />

      {/* Flat ambient grid -- faint texture for the upper hero area */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.35,
          backgroundImage: [
            `repeating-linear-gradient(90deg,color-mix(in srgb, var(--brand-from) 5%, transparent) 0px,color-mix(in srgb, var(--brand-from) 5%, transparent) 1px,transparent 1px,transparent 80px)`,
            `repeating-linear-gradient(0deg,color-mix(in srgb, var(--brand-to) 5%, transparent) 0px,color-mix(in srgb, var(--brand-to) 5%, transparent) 1px,transparent 1px,transparent 80px)`,
          ].join(","),
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glowing dots at random grid intersections */}
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            backgroundColor: "var(--brand-from)",
            boxShadow: "0 0 6px 2px color-mix(in srgb, var(--brand-from) 50%, transparent)",
            animation: `dot-glow ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
            /* willChange removed — CSS animation promotes layer */
            opacity: 0,
          }}
        />
      ))}

      {/* Bottom gradient -- fades grid into bg-primary for seamless section transition */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "45%",
          background:
            "linear-gradient(to bottom, transparent 0%, var(--bg-primary) 100%)",
        }}
      />

      {/* Top vignette -- soft fade from bg-primary at the very top */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "20%",
          background:
            "linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
