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
        <ScrollReveal>
          <h2 className="text-center font-display text-3xl font-bold md:text-5xl">
            <GradientText from="#7c3aed" to="#06d6a0">
              One Creator. Four Pillars. Infinite Worlds.
            </GradientText>
          </h2>
        </ScrollReveal>

        {/* ── Two-Column Layout ─────────────────────────────── */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left Column: Philosophy ────────────────────── */}
          <ScrollReveal direction="left">
            <div className="flex flex-col justify-center space-y-6">
              {/* Styled quote */}
              <blockquote className="pl-5 border-l-2 border-accent/50">
                <p className="text-lg font-light text-text-secondary italic">
                  &ldquo;AI doesn&apos;t replace creativity — it amplifies it.&rdquo;
                </p>
              </blockquote>

              <p className="text-base leading-relaxed text-text-secondary">
                NeoByteStudios is built on a radical idea: a single creator,
                empowered by AI, can rival entire studios. Not by replacing
                talent, but by removing the bottlenecks that hold visionaries
                back.
              </p>
              <p className="text-base leading-relaxed text-text-secondary">
                Every intellectual property we create is designed for cross-media
                from day zero. A world isn&apos;t just a book — it&apos;s a game, a
                visual experience, a licensable universe.
              </p>
              <p className="text-base leading-relaxed text-text-secondary">
                AI makes imagination scalable and frees creators from
                operational limits.
              </p>
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
