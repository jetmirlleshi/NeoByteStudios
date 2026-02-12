import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { seededRandom } from "@/lib/utils";

/* ─── Particle type ─────────────────────────────────────────── */
interface Particle {
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  color: "white" | "brand";
}

function generateParticles(count: number): Particle[] {
  const rand = seededRandom(1337); // different seed from GridBackground
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      left: `${Math.round(rand() * 100)}%`,
      top: `${Math.round(rand() * 100)}%`,
      size: 1 + Math.round(rand() * 2), // 1-3px
      delay: rand() * 10,
      duration: 6 + rand() * 8, // 6-14s — slow drift
      color: rand() > 0.5 ? "brand" : "white",
    });
  }
  return particles;
}

/* ─── Module-level constant — deterministic with fixed seed ── */
const PARTICLES = generateParticles(18);

/* ─── Component ─────────────────────────────────────────────── */
export default function IPShowcase() {
  return (
    <section
      id="ip-showcase"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Keyframe definitions for particles */}
      <style>{`
        @keyframes ip-particle-drift {
          0%   { opacity: 0; transform: translateY(0); }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-40px); }
        }
      `}</style>

      {/* Top gradient separator — smooth transition from bg-primary */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "80px",
          background:
            "linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%)",
        }}
      />

      {/* Bottom gradient separator — smooth transition to next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "80px",
          background:
            "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
        }}
      />

      {/* Card container */}
      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <ScrollReveal>
          {/* Animated gradient border wrapper — rotating conic-gradient "border" */}
          <div
            className="nebula-border rounded-2xl p-[1px]"
            style={{
              background:
                "conic-gradient(from var(--border-angle), rgba(124,58,237,0.4) 0%, rgba(59,130,246,0.2) 25%, rgba(124,58,237,0.15) 50%, rgba(59,130,246,0.3) 75%, rgba(124,58,237,0.4) 100%)",
              animation: "border-rotate 8s linear infinite",
            }}
          >
            {/* Main card — animated nebula background */}
            <div
              className="nebula-card relative overflow-hidden rounded-2xl p-12 md:p-16"
              style={{
                backgroundImage: [
                  "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 70%)",
                  "radial-gradient(ellipse 50% 60% at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 70%)",
                  "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 60%)",
                ].join(", "),
                backgroundColor: "var(--bg-card)",
                backgroundSize: "200% 200%, 200% 200%, 200% 200%",
                animation: "nebula-drift 20s ease-in-out infinite",
              }}
            >
              {/* Slowly rotating conic overlay for added depth */}
              <div
                aria-hidden="true"
                className="nebula-rotate-overlay pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
              >
                <div
                  style={{
                    width: "150%",
                    height: "150%",
                    background:
                      "conic-gradient(from 0deg, rgba(124,58,237,0.04), transparent 30%, rgba(59,130,246,0.03), transparent 60%, rgba(124,58,237,0.04))",
                    borderRadius: "50%",
                    animation: "nebula-rotate 60s linear infinite",
                    opacity: 0.5,
                  }}
                />
              </div>

              {/* Soft outer glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  boxShadow:
                    "0 0 80px 8px rgba(124,58,237,0.08), 0 0 40px 4px rgba(59,130,246,0.06)",
                }}
              />

              {/* Particles — CSS-only twinkling stars */}
              {PARTICLES.map((p, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="pointer-events-none absolute"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    borderRadius: "50%",
                    backgroundColor:
                      p.color === "brand"
                        ? "rgba(124,58,237,0.5)"
                        : "rgba(255,255,255,0.35)",
                    boxShadow:
                      p.color === "brand"
                        ? "0 0 4px 1px rgba(124,58,237,0.3)"
                        : "0 0 3px 1px rgba(255,255,255,0.15)",
                    animation: `ip-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
                    willChange: "opacity, transform",
                    opacity: 0,
                  }}
                />
              ))}

              {/* Text content — centered */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold md:text-4xl">
                  <GradientText>
                    Our first universe is being forged.
                  </GradientText>
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-base text-text-secondary md:text-lg">
                  A fantasy world born from the collaboration between human
                  imagination and artificial intelligence. Coming 2026.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
