import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Play, ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';

// Particle component for background effect
function Particle({ delay }: { delay: number }) {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${15 + Math.random() * 10}s`,
  };
  return <div className="particle" style={style} />;
}

export function Hero() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Welcome to the future of creativity! Check your inbox.');
    setEmail('');
    setIsSubmitting(false);
  };

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/30 dark:via-blue-950/30 dark:to-emerald-950/30 animate-gradient" />
      
      {/* Particle effects */}
      <div className="particles-container">
        {particles.map((i) => (
          <Particle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            AI-Powered Creative Studio
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="block gradient-text mb-2">NeoByteStudios</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-slate-600 dark:text-slate-400">
            Where AI Meets Imagination
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          One creator, AI-amplified. Building original cross-media intellectual properties 
          that span books, games, and visual media.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="https://neobytewriter.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 hover:from-violet-700 hover:via-blue-700 hover:to-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Creating Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
          
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-slate-300 dark:border-slate-600 hover:border-violet-500 dark:hover:border-violet-500 px-8 py-6 text-lg rounded-xl group"
            onClick={() => toast.info('Demo video coming soon!')}
          >
            <Play className="w-5 h-5 mr-2 group-hover:text-violet-500 transition-colors" />
            Watch Demo
          </Button>
        </div>

        {/* Email capture form */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                type="email"
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-5 text-base rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 px-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Joining...
                </span>
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Join <span className="font-semibold text-violet-600">2,847</span> creators waiting for early access
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Cross-Media IP</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI-Enhanced</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>One-Person Studio</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
