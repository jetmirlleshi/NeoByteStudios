import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Sparkles, 
  Bug, 
  Zap, 
  Calendar,
  Check,
  Clock,
  ArrowRight,
  Github,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

// CLAUDE: Update this data when you release new features
// You can fetch this from your backend or GitHub API
interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'breaking';
  items: {
    text: string;
    type: 'new' | 'improved' | 'fixed';
  }[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    id: '1',
    version: 'v1.2.0',
    date: '2025-03-01',
    title: 'Character Relationships & Timeline View',
    description: 'Major update focusing on character management and story timeline visualization.',
    type: 'feature',
    items: [
      { text: 'Character relationship mapping with interactive graph', type: 'new' },
      { text: 'Timeline view for tracking story events chronologically', type: 'new' },
      { text: 'Export to PDF with custom formatting options', type: 'improved' },
      { text: 'Faster AI suggestions (2x speed improvement)', type: 'improved' },
    ],
  },
  {
    id: '2',
    version: 'v1.1.0',
    date: '2025-02-15',
    title: 'World-Building Templates & Dark Mode',
    description: 'New templates for faster world creation and improved UI with dark mode support.',
    type: 'feature',
    items: [
      { text: '10 new world-building templates (fantasy, sci-fi, horror)', type: 'new' },
      { text: 'Dark mode for late-night writing sessions', type: 'new' },
      { text: 'Improved character form with more fields', type: 'improved' },
      { text: 'Fixed sync issues on mobile devices', type: 'fixed' },
    ],
  },
  {
    id: '3',
    version: 'v1.0.5',
    date: '2025-02-01',
    title: 'Bug Fixes & Performance',
    description: 'Stability improvements and bug fixes based on user feedback.',
    type: 'bugfix',
    items: [
      { text: 'Fixed autosave not triggering consistently', type: 'fixed' },
      { text: 'Resolved character deletion bug', type: 'fixed' },
      { text: 'Improved loading speed for large projects', type: 'improved' },
    ],
  },
  {
    id: '4',
    version: 'v1.0.0',
    date: '2025-01-20',
    title: 'NeoByteWriter Launch',
    description: 'Official launch of NeoByteWriter - AI-powered writing tool for fantasy authors.',
    type: 'feature',
    items: [
      { text: 'Character tracking and management', type: 'new' },
      { text: 'World-building tools and templates', type: 'new' },
      { text: 'Plot management with chapter organization', type: 'new' },
      { text: 'AI-powered writing suggestions', type: 'new' },
    ],
  },
];

// Upcoming features
interface UpcomingFeature {
  title: string;
  description: string;
  eta: string;
  status: 'planned' | 'in-progress' | 'beta';
}

const UPCOMING: UpcomingFeature[] = [
  {
    title: 'Collaborative Editing',
    description: 'Real-time collaboration for teams. Multiple authors working on the same project simultaneously.',
    eta: 'Q2 2025',
    status: 'in-progress',
  },
  {
    title: 'Mobile App',
    description: 'Native iOS and Android apps for writing on the go with offline support.',
    eta: 'Q2 2025',
    status: 'planned',
  },
  {
    title: 'Advanced AI Plot Suggestions',
    description: 'AI that analyzes your story and suggests plot twists, character arcs, and conflict resolutions.',
    eta: 'Q3 2025',
    status: 'planned',
  },
  {
    title: 'Export to Game Engines',
    description: 'Direct export to Unity and Unreal Engine for game developers.',
    eta: 'Q4 2025',
    status: 'planned',
  },
];

const typeConfig = {
  feature: { label: 'Feature', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', icon: Rocket },
  improvement: { label: 'Improvement', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: Zap },
  bugfix: { label: 'Bug Fix', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: Bug },
  breaking: { label: 'Breaking Change', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: Sparkles },
};

const itemTypeConfig = {
  new: { label: 'New', color: 'bg-violet-500' },
  improved: { label: 'Improved', color: 'bg-blue-500' },
  fixed: { label: 'Fixed', color: 'bg-emerald-500' },
};

const statusConfig = {
  planned: { label: 'Planned', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  'in-progress': { label: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  beta: { label: 'Beta', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
};

export function Changelog() {
  const [showNotificationSignup, setShowNotificationSignup] = useState(false);
  const [email, setEmail] = useState('');

  const handleNotificationSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    // CLAUDE: Connect to your notification service
    toast.success('You\'ll be notified about new releases!');
    setEmail('');
    setShowNotificationSignup(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section id="changelog" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            Changelog
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What&apos;s New at NeoByteStudios
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Track our progress as we build the future of AI-assisted creativity.
          </p>

          {/* Notification CTA */}
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setShowNotificationSignup(true)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Get Release Notifications
          </Button>
        </div>

        {/* Notification signup modal */}
        {showNotificationSignup && (
          <Card className="mb-8 border-violet-200 dark:border-violet-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Get Notified About New Releases
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotificationSignup(false)}
                >
                  ✕
                </Button>
              </div>
              <form onSubmit={handleNotificationSignup} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <Button type="submit" className="bg-gradient-to-r from-violet-600 to-blue-600">
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Features */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-500" />
            Coming Soon
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {UPCOMING.map((feature, index) => (
              <Card key={index} className="border-dashed border-2">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <Badge className={statusConfig[feature.status].color}>
                      {statusConfig[feature.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    ETA: {feature.eta}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Changelog Timeline */}
        <div className="relative">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500" />
            Release History
          </h3>

          {/* Timeline line */}
          <div className="absolute left-4 top-16 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-8">
            {CHANGELOG.map((entry) => {
              const typeInfo = typeConfig[entry.type];
              const TypeIcon = typeInfo.icon;

              return (
                <div key={entry.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-2 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${
                    entry.type === 'feature' ? 'bg-violet-500' :
                    entry.type === 'improvement' ? 'bg-blue-500' :
                    entry.type === 'bugfix' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />

                  <Card>
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className={typeInfo.color}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {typeInfo.label}
                        </Badge>
                        <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                          {entry.version}
                        </span>
                        <span className="text-sm text-slate-400">
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {entry.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {entry.description}
                      </p>

                      {/* Items */}
                      <ul className="space-y-2">
                        {entry.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Badge 
                              className={`${itemTypeConfig[item.type].color} text-white text-xs flex-shrink-0 mt-0.5`}
                            >
                              {itemTypeConfig[item.type].label}
                            </Badge>
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* GitHub Link */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Want to see the code behind NeoByteStudios?
          </p>
          <a
            href="https://github.com/jetmirlleshi/NeoByteStudios"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
