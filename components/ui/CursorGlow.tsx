"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * CursorGlow renders a large, subtle radial gradient that follows the mouse
 * cursor within its parent container. Uses requestAnimationFrame for smooth
 * tracking with a slight interpolation lag for an organic feel.
 *
 * - Appears only when the mouse is inside the container (fades in/out).
 * - Respects `prefers-reduced-motion`: shows a static centered glow instead.
 * - Fully pointer-events-none so it never blocks interactions.
 */
export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Store mouse and interpolated positions in refs to avoid re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Interpolation factor — lower = more lag = more organic
  const LERP_FACTOR = 0.08;

  const animate = useCallback(() => {
    if (!glowRef.current) return;

    // Linearly interpolate towards the actual mouse position
    currentPos.current.x +=
      (mousePos.current.x - currentPos.current.x) * LERP_FACTOR;
    currentPos.current.y +=
      (mousePos.current.y - currentPos.current.y) * LERP_FACTOR;

    glowRef.current.style.background = `radial-gradient(
      350px circle at ${currentPos.current.x}px ${currentPos.current.y}px,
      rgba(124, 58, 237, 0.15) 0%,
      rgba(124, 58, 237, 0.06) 40%,
      transparent 70%
    )`;

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Don't run the animation loop for reduced motion
    if (prefersReducedMotion) return;

    const section = glowRef.current?.parentElement;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Snap current position to avoid slow drift from corner on first enter
      mousePos.current = { x, y };
      currentPos.current = { x, y };
      setIsHovering(true);
      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      cancelAnimationFrame(rafId.current);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [prefersReducedMotion, animate]);

  // Reduced motion: static centered glow, always visible
  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `radial-gradient(
            400px circle at 50% 50%,
            rgba(124, 58, 237, 0.10) 0%,
            rgba(124, 58, 237, 0.04) 40%,
            transparent 70%
          )`,
        }}
      />
    );
  }

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        opacity: isHovering ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
