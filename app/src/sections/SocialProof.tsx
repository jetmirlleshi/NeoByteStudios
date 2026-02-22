import { useRef, useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Fantasy Author',
    avatar: 'SC',
    content: 'NeoByteWriter completely transformed how I organize my world-building. What used to take weeks now takes days. The AI suggestions are incredibly intuitive.',
    rating: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'Indie Game Developer',
    avatar: 'MW',
    content: 'The cross-media approach is genius. I can develop my game universe and book simultaneously, keeping everything consistent. Pure magic.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Creative Director',
    avatar: 'ER',
    content: 'As a solo creator, I never thought I could compete with big studios. NeoByteStudios proved me wrong. The AI amplification is real.',
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Screenwriter',
    avatar: 'JP',
    content: 'The character tracking feature alone is worth it. No more continuity errors, no more lost notes. Everything is connected and accessible.',
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-full sm:w-[400px] p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
      <Quote className="w-8 h-8 text-violet-500 mb-4" />
      
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      
      <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        "{testimonial.content}"
      </p>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-semibold">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      checkScroll();
    }
    return () => scrollEl?.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-violet-50/50 to-transparent dark:via-violet-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Early Adopter Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Loved by Creators Worldwide
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join thousands of authors, developers, and creatives who are already building their universes with NeoByteStudios.
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <div className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full shadow-lg bg-white dark:bg-slate-800 ${
                !canScrollLeft && 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full shadow-lg bg-white dark:bg-slate-800 ${
                !canScrollRight && 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="snap-start">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold gradient-text">4.9/5</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Average Rating</div>
          </div>
          <div className="w-px h-12 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div>
            <div className="text-3xl font-bold gradient-text">500+</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Active Users</div>
          </div>
          <div className="w-px h-12 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div>
            <div className="text-3xl font-bold gradient-text">50K+</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Stories Created</div>
          </div>
        </div>
      </div>
    </section>
  );
}
