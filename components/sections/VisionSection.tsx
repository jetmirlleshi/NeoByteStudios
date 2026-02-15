import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PillarDiagram from "@/components/ui/PillarDiagram";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

export default function VisionSection() {
  return (
    <section id="vision" className="relative overflow-hidden py-32 md:py-48">
      <FloatingOrbs seed={99} />
      <div className="relative mx-auto max-w-6xl px-4">
        {/* ── Section Title ─────────────────────────────────── */}
        <div className="text-center mb-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold md:text-5xl lg:text-6xl tracking-tight">
              <GradientText from="#7c3aed" to="#06d6a0">
                One Creator. Four Pillars. Infinite Worlds.
              </GradientText>
            </h2>
          </ScrollReveal>
        </div>

        {/* ── Subtitle ────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <p className="mx-auto max-w-2xl text-center text-lg text-text-secondary mb-20">
            A single vision, amplified by AI, brought to life through four
            specialized divisions working in harmony.
          </p>
        </ScrollReveal>

        {/* ── Two-Column Layout ─────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* ── Left Column: Philosophy ────────────────────── */}
          <ScrollReveal direction="left">
            <div className="flex flex-col justify-center space-y-8">
              {/* Styled quote */}
              <blockquote className="relative pl-6">
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{
                    background:
                      "linear-gradient(to bottom, #7c3aed, #06d6a0)",
                  }}
                />
                <p className="text-xl font-light text-text-secondary italic leading-relaxed">
                  &ldquo;AI doesn&apos;t replace creativity — it amplifies
                  it.&rdquo;
                </p>
              </blockquote>

              {/* Philosophy cards */}
              <div className="space-y-5">
                <div className="rounded-xl border border-border-custom bg-bg-secondary/40 p-5 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#7c3aed" }}
                    />
                    <span className="text-sm font-semibold text-text-primary">
                      The Vision
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    NeoByteStudios is built on a radical idea: a single creator,
                    empowered by AI, can rival entire studios. Not by replacing
                    talent, but by removing the bottlenecks that hold visionaries
                    back.
                  </p>
                </div>

                <div className="rounded-xl border border-border-custom bg-bg-secondary/40 p-5 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#3b82f6" }}
                    />
                    <span className="text-sm font-semibold text-text-primary">
                      Cross-Media DNA
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    Every intellectual property we create is designed for
                    cross-media from day zero. A world isn&apos;t just a book —
                    it&apos;s a game, a visual experience, a licensable universe.
                  </p>
                </div>

                <div className="rounded-xl border border-border-custom bg-bg-secondary/40 p-5 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#06d6a0" }}
                    />
                    <span className="text-sm font-semibold text-text-primary">
                      AI-Powered Scale
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    AI makes imagination scalable and frees creators from
                    operational limits. What once required teams of dozens now
                    flows from a single creative mind.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right Column: Pillar Diagram ───────────────── */}
          <ScrollReveal direction="right">
            <PillarDiagram />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
