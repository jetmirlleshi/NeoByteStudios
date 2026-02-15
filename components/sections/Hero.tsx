"use client";

import { useCallback, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const GridBackground = dynamic(() => import("@/components/ui/GridBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});
const CursorGlow = dynamic(() => import("@/components/ui/CursorGlow"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});
const HeroVisual = dynamic(() => import("@/components/ui/HeroVisual"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});
import GradientText from "@/components/ui/GradientText";
import MagneticButton from "@/components/ui/MagneticButton";
import { NAVBAR_HEIGHT, SITE } from "@/lib/constants";

// ─── Animation Variants ─────────────────────────────────────────

const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

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
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  const scrollToDivisions = useCallback(() => {
    const target = document.getElementById("divisions");
    if (!target) return;

    const top =
      target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

    window.scrollTo({ top, behavior: "smooth" });
  }, []);

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

  const chars = SITE.name.split("");

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Animated grid background — parallax layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={prefersReducedMotion ? undefined : { y: bgY }}
      >
        <ErrorBoundary>
          <GridBackground />
        </ErrorBoundary>
      </motion.div>

      {/* Abstract generative visual — parallax layer */}
      <motion.div
        className="absolute inset-0 z-[2]"
        style={prefersReducedMotion ? undefined : { y: visualY }}
      >
        <ErrorBoundary>
          <HeroVisual />
        </ErrorBoundary>
      </motion.div>

      {/* Interactive cursor glow */}
      <ErrorBoundary>
        <CursorGlow />
      </ErrorBoundary>

      {/* Centred content stack */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}>
        {/* 1. Logo / studio name — display font with typing reveal */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <GradientText>
            {prefersReducedMotion ? (
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
                    style={char === " " ? { width: "0.3em" } : undefined}
                  >
                    {char}
                  </motion.span>
                ))}

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
          <span className="sr-only"> — AI-Powered Creative Studio for Cross-Media IP</span>
        </h1>

        {/* 2. Tagline — with accent color highlight */}
        <motion.p
          {...fadeSlideUp(1)}
          className="mt-6 text-xl md:text-2xl lg:text-3xl text-text-secondary font-light tracking-wide"
        >
          {SITE.tagline}
        </motion.p>

        {/* 3. Subtitle */}
        <motion.p
          {...fadeSlideUp(2)}
          className="mt-3 max-w-xl mx-auto text-base md:text-lg text-text-muted"
        >
          One creator, AI-amplified. Building universes that span books, games, and visual media.
        </motion.p>

        {/* 4. CTA button — now with accent color */}
        <motion.div {...fadeSlideUp(3)} className="mt-10">
          <MagneticButton>
            <button
              type="button"
              onClick={scrollToDivisions}
              className="
                group relative rounded-full p-[1px]
                bg-gradient-to-r from-brand-from to-accent
                transition-shadow duration-300
                hover:shadow-[0_0_24px_4px_rgba(6,214,160,0.35)]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent focus-visible:ring-offset-2
                focus-visible:ring-offset-bg-primary
              "
            >
              <span
                className="
                  relative block rounded-full px-8 py-3 overflow-hidden
                  bg-bg-primary text-text-primary font-medium
                  transition-colors duration-300
                  group-hover:bg-bg-primary/90
                "
              >
                Explore Our Divisions&nbsp;&darr;

                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0
                    motion-safe:animate-[shimmer_4s_ease-in-out_infinite]
                  "
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)",
                  }}
                />
              </span>
            </button>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
