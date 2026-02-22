import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Play, ArrowRight, Sparkles, Zap, Globe, Volume2, VolumeX } from 'lucide-react';

// Particle component for background effect
function Particle({ delay }: { delay: number }) {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${15 + Math.random() * 10}s`,
  };
  return <div className="particle" style={style} />;
}

export function VideoHero() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    // CLAUDE: Connect to your email service (ConvertKit, Mailchimp, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Welcome to the future of creativity! Check your inbox.');
    setEmail('');
    setIsSubmitting(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Fallback video URL - using a creative/abstract video
  // CLAUDE: Replace with your own video file hosted on CDN (Cloudinary, AWS S3, etc.)
  const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4';
  const posterUrl = '/hero-poster.jpg'; // CLAUDE: Add poster image

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={posterUrl}
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
          {/* CLAUDE: Add multiple sources for compatibility */}
          {/* <source src="your-video.webm" type="video/webm" /> */}
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        
        {/* Gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-transparent to-blue-900/30" />
      </div>

      {/* Particle effects overlay */}
      <div className="particles-container z-10">
        {particles.map((i) => (
          <Particle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Video controls */}
      <button
        onClick={toggleMute}
        className="absolute bottom-24 right-6 z-30 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white/90">
            AI-Powered Creative Studio
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 mb-2">
            NeoByteStudios
          </span>
          <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-white/80">
            Where AI Meets Imagination
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/70 mb-10 leading-relaxed">
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
            className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl group backdrop-blur-sm"
            onClick={() => {
              // CLAUDE: Integrate with video modal or YouTube embed
              toast.info('Demo video coming soon!');
            }}
          >
            <Play className="w-5 h-5 mr-2 group-hover:text-violet-400 transition-colors" />
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
                className="h-14 px-5 text-base rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-violet-400 focus:bg-white/20 backdrop-blur-sm"
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
          <p className="mt-3 text-sm text-white/60">
            Join <span className="font-semibold text-violet-400">2,847</span> creators waiting for early access
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Cross-Media IP</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI-Enhanced</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>One-Person Studio</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
