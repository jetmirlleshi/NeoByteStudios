import { useRef, useEffect, useState } from 'react';
import { Lightbulb, Layers, Cpu, ArrowRight } from 'lucide-react';

interface VisionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

function VisionCard({ icon, title, description, color, delay }: VisionCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white mb-5`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
    </div>
  );
}

export function Vision() {
  const visionCards = [
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: 'The Vision',
      description: 'NeoByteStudios is built on a radical idea: a single creator, empowered by AI, can rival entire studios. Not by replacing talent, but by removing the bottlenecks that hold visionaries back.',
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
      delay: 0,
    },
    {
      icon: <Layers className="w-7 h-7" />,
      title: 'Cross-Media DNA',
      description: 'Every intellectual property we create is designed for cross-media from day zero. A world isn\'t just a book — it\'s a game, a visual experience, a licensable universe.',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      delay: 150,
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: 'AI-Powered Scale',
      description: 'AI makes imagination scalable and frees creators from operational limits. What once required teams of dozens now flows from a single creative mind.',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      delay: 300,
    },
  ];

  return (
    <section id="vision" className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main quote */}
        <div className="text-center mb-16">
          <blockquote className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl text-violet-200 dark:text-violet-800 font-serif">
              "
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-slate-800 dark:text-slate-200 italic mb-6 relative z-10">
              AI doesn't replace creativity — it amplifies it.
            </p>
            <footer className="text-slate-500 dark:text-slate-400">
              — NeoByteStudios Manifesto
            </footer>
          </blockquote>
        </div>

        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            One Creator. Four Pillars. Infinite Worlds.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A single vision, amplified by AI, brought to life through four specialized divisions working in harmony.
          </p>
        </div>

        {/* Vision cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {visionCards.map((card, index) => (
            <VisionCard key={index} {...card} />
          ))}
        </div>

        {/* Interactive diagram */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 sm:p-12 overflow-hidden">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              The NeoByte Ecosystem
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              How our divisions work together to create cross-media universes
            </p>
          </div>

          {/* Diagram */}
          <div className="flex flex-col items-center">
            {/* Center hub */}
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-lg">IP</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-emerald-500 blur-xl opacity-50 animate-pulse" />
            </div>

            {/* Connected divisions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
              {[
                { name: 'Writer', color: 'from-violet-500 to-violet-600', icon: '✍️' },
                { name: 'Forge', color: 'from-blue-500 to-blue-600', icon: '⚒️' },
                { name: 'Games', color: 'from-emerald-500 to-emerald-600', icon: '🎮' },
                { name: 'Vision', color: 'from-amber-500 to-orange-600', icon: '👁️' },
              ].map((division) => (
                <div
                  key={division.name}
                  className="flex flex-col items-center p-4 rounded-xl bg-white dark:bg-slate-700 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${division.color} flex items-center justify-center text-white text-lg mb-2`}>
                    {division.icon}
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white text-sm">{division.name}</span>
                </div>
              ))}
            </div>

            {/* Output */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
              <div className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 border border-violet-200 dark:border-violet-800">
                <span className="font-medium text-violet-700 dark:text-violet-300">
                  Cross-Media Universe
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://neobytewriter.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-medium hover:gap-3 transition-all"
          >
            Start building your universe today
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
