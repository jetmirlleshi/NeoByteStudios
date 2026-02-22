import { Sparkles, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    studio: [
      { label: 'About', href: '#vision' },
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'Launch', href: '#countdown' },
    ],
    divisions: [
      { label: 'NeoByteWriter', href: 'https://neobytewriter.vercel.app', external: true },
      { label: 'NeoByteForge', href: '#roadmap' },
      { label: 'NeoByteGames', href: '#roadmap' },
      { label: 'NeoByteVision', href: '#roadmap' },
    ],
    connect: [
      { label: 'Twitter', href: 'https://x.com/neobytestudios', external: true, icon: Twitter },
      { label: 'Instagram', href: 'https://instagram.com/neobytestudios', external: true, icon: Instagram },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/neobytestudios', external: true, icon: Linkedin },
    ],
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">NeoByteStudios</span>
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Where AI Meets Imagination
            </p>
            <a
              href="https://neobytewriter.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 text-white text-sm font-medium hover:from-violet-600 hover:to-blue-600 transition-colors"
            >
              Start Creating
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Studio links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Studio</h4>
            <ul className="space-y-3">
              {footerLinks.studio.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Divisions links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Divisions</h4>
            <ul className="space-y-3">
              {footerLinks.divisions.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                    {link.external && (
                      <span className="ml-1 text-xs text-slate-400">↗</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              {footerLinks.connect.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} NeoByteStudios. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> and AI. Powered by imagination.
          </p>
        </div>
      </div>
    </footer>
  );
}
