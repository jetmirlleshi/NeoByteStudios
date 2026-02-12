"use client";

import { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";

const GridBackground = dynamic(() => import("@/components/ui/GridBackground"), {
  ssr: false,
});
const CursorGlow = dynamic(() => import("@/components/ui/CursorGlow"), {
  ssr: false,
});
import GradientText from "@/components/ui/GradientText";
import { NAVBAR_HEIGHT, SITE } from "@/lib/constants";

// ─── Animation Variants ─────────────────────────────────────────

/** Container variant that staggers each character's entrance */
const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

/** Each character fades in and slides up */
const charVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

/** Blinking caret that appears after the last character is revealed */
const caretDelay = SITE.name.length * 0.04 + 0.3;

const caretVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0, 1, 0, 1, 0],
    transition: {
      delay: caretDelay,
      duration: 1.5,
      ease: "linear" as const,
      times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 1],
    },
  },
};

// ─── Component ──────────────────────────────────────────────────

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const scrollToDivisions = useCallback(() => {
    const target = document.getElementById("divisions");
    if (!target) return;

    const top =
      target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  /** Standard fade-slide-up used for tagline, subtitle, and CTA */
  const fadeSlideUp = (index: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            delay: index * 0.2,
            duration: 0.6,
            ease: "easeOut" as const,
          },
        };

  // Split studio name into individual characters for the typing effect
  const chars = SITE.name.split("");

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Animated grid background — sits behind all content */}
      <GridBackground />

      {/* Interactive cursor glow — above grid, below content */}
      <CursorGlow />

      {/* Centred content stack */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* 1. Logo / studio name — word-by-word reveal with typing caret */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <GradientText>
            {prefersReducedMotion ? (
              // Reduced motion: just show the full name instantly
              SITE.name
            ) : (
              <motion.span
                className="inline-flex"
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                aria-label={SITE.name}
              >
                {chars.map((char, i) => (
                  <motion.span
                    key={i}
                    variants={charVariants}
                    className="inline-block"
                    // Preserve whitespace for any spaces in the name
                    style={char === " " ? { width: "0.3em" } : undefined}
                  >
                    {char}
                  </motion.span>
                ))}

                {/* Blinking caret — thin vertical line in brand gradient */}
                <motion.span
                  variants={caretVariants}
                  className="inline-block ml-[2px]"
                  style={{
                    width: "2px",
                    height: "1em",
                    alignSelf: "center",
                    background:
                      "linear-gradient(to bottom, var(--brand-from), var(--brand-to))",
                    borderRadius: "1px",
                  }}
                  aria-hidden="true"
                />
              </motion.span>
            )}
          </GradientText>
        </h1>

        {/* 2. Tagline */}
        <motion.p
          {...fadeSlideUp(1)}
          className="mt-4 text-xl md:text-2xl text-text-secondary"
        >
          {SITE.tagline}
        </motion.p>

        {/* 3. Subtitle / mission statement */}
        <motion.p
          {...fadeSlideUp(2)}
          className="mt-2 max-w-xl mx-auto text-base md:text-lg text-text-muted"
        >
          An AI-first studio creating cross-media intellectual properties.
        </motion.p>

        {/* 4. CTA button with gradient border, hover glow, and shimmer */}
        <motion.div {...fadeSlideUp(3)} className="mt-8">
          <button
            type="button"
            onClick={scrollToDivisions}
            className="
              group relative rounded-full p-[1px]
              bg-gradient-to-r from-brand-from to-brand-to
              transition-shadow duration-300
              hover:shadow-[0_0_24px_4px_rgba(124,58,237,0.45)]
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-from focus-visible:ring-offset-2
              focus-visible:ring-offset-bg-primary
            "
          >
            {/* Inner surface — matches page background for "border" illusion */}
            <span
              className="
                relative block rounded-full px-8 py-3 overflow-hidden
                bg-bg-primary text-text-primary font-medium
                transition-colors duration-300
                group-hover:bg-bg-primary/90
              "
            >
              Explore Our Divisions&nbsp;&darr;

              {/* Shimmer overlay — diagonal white gradient that sweeps across */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0
                  motion-safe:animate-[shimmer_4s_ease-in-out_infinite]
                "
                style={{
                  background:
                    "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)",
                  // Animation is paused when prefers-reduced-motion is active
                  // because globals.css sets animation-duration: 0.01ms
                }}
              />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
