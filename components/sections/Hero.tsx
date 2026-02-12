"use client";

import { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";

const GridBackground = dynamic(() => import("@/components/ui/GridBackground"), {
  ssr: false,
});
import GradientText from "@/components/ui/GradientText";
import { NAVBAR_HEIGHT, SITE } from "@/lib/constants";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

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
          transition: { delay: index * 0.2, duration: 0.6, ease: "easeOut" as const },
        };

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Animated grid background — sits behind all content */}
      <GridBackground />

      {/* Centred content stack */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* 1. Logo / studio name */}
        <motion.div {...fadeSlideUp(0)}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <GradientText>{SITE.name}</GradientText>
          </h1>
        </motion.div>

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

        {/* 4. CTA button with gradient border + hover glow */}
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
            {/* Inner surface — matches page background to create the "border" illusion */}
            <span
              className="
                block rounded-full px-8 py-3
                bg-bg-primary text-text-primary font-medium
                transition-colors duration-300
                group-hover:bg-bg-primary/90
              "
            >
              Explore Our Divisions&nbsp;&darr;
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
