"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  /** Max pixel offset the button can drift toward the cursor (default: 8) */
  maxOffset?: number;
  /** Multiplier for how strongly the button is attracted (default: 0.3) */
  strength?: number;
  /** Extra padding around the button that acts as the proximity zone (default: 100) */
  proximity?: number;
}

/**
 * MagneticButton wraps its children in a proximity zone. When the cursor
 * enters the zone, the inner content subtly drifts toward the pointer.
 * When the cursor leaves, it smoothly returns to center.
 *
 * - Uses requestAnimationFrame for buttery-smooth updates.
 * - Respects `prefers-reduced-motion`: renders children without effect.
 * - Fully accessible — the DOM structure is a plain div wrapper.
 */
export default function MagneticButton({
  children,
  maxOffset = 8,
  strength = 0.3,
  proximity = 100,
}: MagneticButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  // Store target offset in a ref to avoid re-renders on every mouse move
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  const LERP_FACTOR = 0.12;

  const animate = useCallback(() => {
    if (!innerRef.current) return;

    // Lerp toward target
    currentOffset.current.x +=
      (targetOffset.current.x - currentOffset.current.x) * LERP_FACTOR;
    currentOffset.current.y +=
      (targetOffset.current.y - currentOffset.current.y) * LERP_FACTOR;

    // Snap to zero when very close (avoid sub-pixel jitter)
    if (
      Math.abs(currentOffset.current.x) < 0.1 &&
      Math.abs(currentOffset.current.y) < 0.1 &&
      targetOffset.current.x === 0 &&
      targetOffset.current.y === 0
    ) {
      currentOffset.current.x = 0;
      currentOffset.current.y = 0;
      innerRef.current.style.transform = "translate(0px, 0px)";
      return; // Stop the loop when fully settled
    }

    innerRef.current.style.transform = `translate(${currentOffset.current.x}px, ${currentOffset.current.y}px)`;

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Center of the container
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Offset from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Apply strength and clamp to maxOffset
      const rawX = deltaX * strength;
      const rawY = deltaY * strength;

      targetOffset.current.x = Math.max(-maxOffset, Math.min(maxOffset, rawX));
      targetOffset.current.y = Math.max(-maxOffset, Math.min(maxOffset, rawY));
    };

    const handleMouseEnter = () => {
      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      // Reset target to center — the animation loop will smoothly return
      targetOffset.current.x = 0;
      targetOffset.current.y = 0;
      // Restart the loop so it can animate back to 0
      rafId.current = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [prefersReducedMotion, animate, strength, maxOffset]);

  // Reduced motion: just render children with no wrapper effect
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      style={{ padding: proximity, margin: -proximity }}
      className="inline-flex items-center justify-center"
    >
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
