import { useRef, useEffect, useState } from 'react';
import { PenTool, Factory, Gamepad2, Eye, Check, Clock, Rocket } from 'lucide-react';

interface RoadmapItem {
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'development' | 'planned';
  progress: number;
  expectedDate?: string;
  color: string;
  features: string[];
}

const roadmapItems: RoadmapItem[] = [
  {
    name: 'NeoByteWriter',
    tagline: 'AI-powered writing tool for fantasy authors',
    description: 'Stop losing track of your story. NeoByteWriter keeps your world, characters, and plot threads organized so you can focus on what matters — the writing.',
    icon: <PenTool className="w-6 h-6" />,
    status: 'active',
    progress: 100,
    color: 'from-violet-500 to-violet-600',
    features: ['Character tracking', 'World-building tools', 'Plot management', 'AI suggestions'],
  },
  {
    name: 'NeoByteForge',
    tagline: 'The IP creation foundry',
    description: 'Build universes that span every medium from day one. NeoByteForge is where original intellectual properties are born — designed for cross-media from the start.',
    icon: <Factory className="w-6 h-6" />,
    status: 'development',
    progress: 25,
    expectedDate: 'Late 2026',
    color: 'from-blue-500 to-blue-600',
    features: ['IP templates', 'Cross-media planning', 'Asset management', 'Collaboration tools'],
  },
  {
    name: 'NeoByteGames',
    tagline: 'Indie games from AI-born universes',
    description: 'Play the stories you read. NeoByteGames transforms our IPs into interactive experiences — indie games where procedural generation meets handcrafted narrative.',
    icon: <Gamepad2 className="w-6 h-6" />,
    status: 'planned',
    progress: 10,
    expectedDate: '2027',
    color: 'from-emerald-500 to-emerald-600',
    features: ['Game engine', 'Narrative systems', 'Procedural worlds', 'Multi-platform'],
  },
  {
    name: 'NeoByteVision',
    tagline: 'Visual content and IP licensing',
    description: 'See the worlds we build. NeoByteVision handles art direction, media production, and licensing — bringing our universes to life across every visual medium.',
    icon: <Eye className="w-6 h-6" />,
    status: 'planned',
    progress: 5,
    expectedDate: '2027',
    color: 'from-amber-500 to-orange-600',
    features: ['Art generation', 'Video production', 'Licensing platform', 'Brand management'],
  },
];

function StatusBadge({ status }: { status: RoadmapItem['status'] }) {
  const configs = {
    completed: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', label: 'Completed', icon: Check },
    active: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', label: 'Active', icon: Rocket },
    development: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'In Development', icon: Clock },
    planned: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: 'Planned', icon: Clock },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function RoadmapCard({ item, index }: { item: RoadmapItem; index: number }) {
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

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'} transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color} ring-4 ring-white dark:ring-slate-900`} />
      </div>

      {/* Card */}
      <div className={`w-full md:w-[calc(50%-2rem)] ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}>
              {item.icon}
            </div>
            <StatusBadge status={item.status} />
          </div>

          {/* Content */}
          <h3 className={`text-xl font-bold mb-1 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
            {item.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{item.tagline}</p>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Progress */}
          {item.status !== 'active' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Development</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: isVisible ? `${item.progress}%` : '0%' }}
                />
              </div>
              {item.expectedDate && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Expected: {item.expectedDate}
                </p>
              )}
            </div>
          )}

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {item.features.map((feature, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Empty space for alternating layout */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </div>
  );
}

export function Roadmap() {
  return (
    <section id="roadmap" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            Our Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Building the Future of Creativity
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Four pillars, one vision. Each division serves a unique role in bringing our intellectual properties to life.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-blue-500 to-emerald-500 hidden md:block" />

          {/* Mobile line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-blue-500 to-emerald-500 md:hidden" />

          {/* Cards */}
          <div className="space-y-8 md:space-y-12">
            {roadmapItems.map((item, index) => (
              <RoadmapCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
