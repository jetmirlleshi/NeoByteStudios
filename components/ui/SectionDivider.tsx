import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "wave" | "angle" | "gradient";
  flip?: boolean;
  className?: string;
}

/**
 * SectionDivider -- pure-CSS visual separator placed between page sections.
 *
 * Variants:
 *  - wave     (default): SVG sine-wave filled with a brand gradient
 *  - angle    : diagonal clip-path slash
 *  - gradient : soft radial glow acting as a light-source divider
 *
 * `flip` mirrors the shape vertically so the wave/angle faces the opposite
 * direction, which is useful when placing it *below* a section.
 */
export default function SectionDivider({
  variant = "wave",
  flip = false,
  className,
}: SectionDividerProps) {
  if (variant === "gradient") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none w-full",
          flip && "[transform:scaleY(-1)]",
          className,
        )}
        style={{
          height: "60px",
          background:
            "radial-gradient(ellipse 50% 80% at 50% 50%, rgba(124,58,237,0.10) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)",
        }}
      />
    );
  }

  if (variant === "angle") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none w-full",
          flip && "[transform:scaleY(-1)]",
          className,
        )}
        style={{
          height: "60px",
          clipPath: "polygon(0 0, 100% 60%, 100% 100%, 0 100%)",
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 100%)",
        }}
      />
    );
  }

  /* ── Wave variant (default) ─────────────────────────────────── */
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none w-full overflow-hidden",
        flip && "[transform:scaleY(-1)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="h-16 w-full md:h-20"
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.15)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0.15)" />
          </linearGradient>
        </defs>
        <path
          fill="url(#wave-gradient)"
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}
