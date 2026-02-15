import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TextReveal from "@/components/ui/TextReveal";
import ScrambleText from "@/components/ui/ScrambleText";
import Countdown from "@/components/ui/Countdown";
import { seededRandom } from "@/lib/utils";

/* ─── Particle type ─────────────────────────────────────────── */
interface Particle {
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  color: "white" | "brand" | "accent";
}

function generateParticles(count: number): Particle[] {
  const rand = seededRandom(1337);
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    particles.push({
      left: `${Math.round(rand() * 100)}%`,
      top: `${Math.round(rand() * 100)}%`,
      size: 1 + Math.round(rand() * 2),
      delay: rand() * 10,
      duration: 6 + rand() * 8,
      color: r > 0.66 ? "accent" : r > 0.33 ? "brand" : "white",
    });
  }
  return particles;
}

const PARTICLES = generateParticles(30);

/* ─── Component ─────────────────────────────────────────────── */
export default function IPShowcase() {
  return (
    <section
      id="ip-showcase"
      className="relative min-h-screen flex items-center justify-center py-32 md:py-48"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Keyframe is defined in globals.css */}

      {/* Top gradient separator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "120px",
          background:
            "linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%)",
        }}
      />

      {/* Bottom gradient separator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "120px",
          background:
            "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
        }}
      />

      {/* Card container */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 w-full">
        <ScrollReveal>
          {/* Animated gradient border */}
          <div
            className="nebula-border rounded-2xl p-[1px]"
            style={{
              background:
                "conic-gradient(from var(--border-angle), rgba(124,58,237,0.4) 0%, rgba(6,214,160,0.2) 25%, rgba(124,58,237,0.15) 50%, rgba(59,130,246,0.3) 75%, rgba(124,58,237,0.4) 100%)",
              animation: "border-rotate 8s linear infinite",
            }}
          >
            {/* Main nebula card */}
            <div
              className="nebula-card relative overflow-hidden rounded-2xl p-12 md:p-20"
              style={{
                backgroundImage: [
                  "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 70%)",
                  "radial-gradient(ellipse 50% 60% at 80% 20%, rgba(6,214,160,0.06) 0%, transparent 70%)",
                  "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 60%)",
                ].join(", "),
                backgroundColor: "var(--bg-card)",
                backgroundSize: "200% 200%, 200% 200%, 200% 200%",
                animation: "nebula-drift 20s ease-in-out infinite",
              }}
            >
              {/* Rotating conic overlay */}
              <div
                aria-hidden="true"
                className="nebula-rotate-overlay pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
              >
                <div
                  style={{
                    width: "150%",
                    height: "150%",
                    background:
                      "conic-gradient(from 0deg, rgba(124,58,237,0.04), transparent 30%, rgba(6,214,160,0.03), transparent 60%, rgba(124,58,237,0.04))",
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
                    "0 0 80px 8px rgba(124,58,237,0.08), 0 0 40px 4px rgba(6,214,160,0.06)",
                }}
              />

              {/* Particles */}
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
                      p.color === "accent"
                        ? "rgba(6,214,160,0.5)"
                        : p.color === "brand"
                          ? "rgba(124,58,237,0.5)"
                          : "rgba(255,255,255,0.35)",
                    boxShadow:
                      p.color === "accent"
                        ? "0 0 4px 1px rgba(6,214,160,0.3)"
                        : p.color === "brand"
                          ? "0 0 4px 1px rgba(124,58,237,0.3)"
                          : "0 0 3px 1px rgba(255,255,255,0.15)",
                    animation: `ip-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
                    opacity: 0,
                  }}
                />
              ))}

              {/* Text content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <TextReveal>
                  <h2 className="font-display text-3xl font-bold md:text-5xl">
                    <GradientText from="var(--brand-from)" to="var(--accent)">
                      Our first universe is being forged.
                    </GradientText>
                  </h2>
                </TextReveal>

                <p className="mx-auto mt-6 max-w-lg text-base text-text-secondary md:text-lg">
                  A fantasy world born from the collaboration between human
                  imagination and artificial intelligence.{' '}
                  <ScrambleText
                    text="Coming 2026."
                    delay={0.8}
                    className="font-semibold text-accent"
                  />
                </p>

                {/* Countdown timer */}
                <div className="mt-10">
                  <Countdown />
                </div>

                {/* CTA */}
                <a
                  href="/#divisions"
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-from to-accent transition-opacity duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  Join the Waitlist&nbsp;&rarr;
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
