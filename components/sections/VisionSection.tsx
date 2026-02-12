import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PillarDiagram from "@/components/ui/PillarDiagram";

export default function VisionSection() {
  return (
    <section id="vision" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        {/* ── Section Title ─────────────────────────────────── */}
        <ScrollReveal>
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            <GradientText>
              One Creator. Four Pillars. Infinite Worlds.
            </GradientText>
          </h2>
        </ScrollReveal>

        {/* ── Two-Column Layout ─────────────────────────────── */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left Column: Philosophy ────────────────────── */}
          <ScrollReveal direction="left">
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-base leading-relaxed text-text-secondary">
                NeoByteStudios is built on a radical idea: a single creator,
                empowered by AI, can rival entire studios. Not by replacing
                talent, but by removing the bottlenecks that hold visionaries
                back.
              </p>
              <p className="mb-4 text-base leading-relaxed text-text-secondary">
                Every intellectual property we create is designed for cross-media
                from day zero. A world isn&apos;t just a book — it&apos;s a game, a
                visual experience, a licensable universe.
              </p>
              <p className="mb-4 text-base leading-relaxed text-text-secondary">
                AI doesn&apos;t replace creativity — it amplifies it. It makes
                imagination scalable and frees creators from operational limits.
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
