import { useEffect } from 'react';
import { Navbar } from './sections/Navbar';
import { VideoHero } from './sections/VideoHero';
import { Stats } from './sections/Stats';
import { SocialProof } from './sections/SocialProof';
import { Roadmap } from './sections/Roadmap';
import { Vision } from './sections/Vision';
import { Countdown } from './sections/Countdown';
import { Pricing } from './sections/Pricing';
import { ReferralProgram } from './sections/ReferralProgram';
import { NewsletterArchive } from './sections/NewsletterArchive';
import { Changelog } from './sections/Changelog';
import { Footer } from './sections/Footer';
import { 
  SmartNotifications, 
  LiveStatsWidget, 
  WelcomeBackNotification 
} from './components/SmartNotifications';
import { Toaster } from '@/components/ui/sonner';

function App() {
  useEffect(() => {
    // Update page title
    document.title = 'NeoByteStudios — Where AI Meets Imagination';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'NeoByteStudios is an AI-powered creative studio building original cross-media intellectual properties. One creator, AI-amplified.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Smart Notifications System */}
      <SmartNotifications />
      <WelcomeBackNotification />
      <LiveStatsWidget />
      
      <Navbar />
      <main>
        {/* Hero with video background */}
        <VideoHero />
        
        {/* Stats section */}
        <Stats />
        
        {/* Social proof / testimonials */}
        <SocialProof />
        
        {/* Roadmap / divisions timeline */}
        <Roadmap />
        
        {/* Vision section */}
        <Vision />
        
        {/* Pricing plans */}
        <Pricing />
        
        {/* Referral program */}
        <ReferralProgram />
        
        {/* Launch countdown */}
        <Countdown />
        
        {/* Newsletter archive */}
        <NewsletterArchive />
        
        {/* Changelog */}
        <Changelog />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
          },
        }}
      />
    </div>
  );
}

export default App;
