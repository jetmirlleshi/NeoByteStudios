import { useEffect, useState, useRef } from 'react';
import { Users, Layers, Globe, Zap } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  color: string;
  delay: number;
}

function StatItem({ icon, value, suffix = '', label, color, delay }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400 text-center">{label}</div>
    </div>
  );
}

export function Stats() {
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      value: 2847,
      suffix: '+',
      label: 'Creators on Waitlist',
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
      delay: 0,
    },
    {
      icon: <Layers className="w-6 h-6 text-white" />,
      value: 4,
      suffix: '',
      label: 'Creative Divisions',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      delay: 100,
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      value: 1,
      suffix: '',
      label: 'Universal IP in Development',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      delay: 200,
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      value: 100,
      suffix: '%',
      label: 'AI-Powered Workflow',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      delay: 300,
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            The One-Person Studio Model
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Proof that one creator with AI can build at studio scale.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
