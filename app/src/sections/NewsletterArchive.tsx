import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  Tag, 
  ArrowRight, 
  BookOpen,
  Mail,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

// CLAUDE: This data should come from your CMS or backend
// For now, it's static. Update this array when you send new newsletters
interface Newsletter {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readTime: string;
  slug: string;
}

const NEWSLETTERS: Newsletter[] = [
  {
    id: '1',
    title: 'AI-Assisted Writing: Tools, Not Ghostwriters',
    excerpt: 'How NeoByteWriter uses AI to help authors organize, track, and maintain consistency — without writing a single word of their story.',
    content: `
      <p>There's a common misconception about AI writing tools: that they'll replace human creativity. At NeoByteStudios, we believe the opposite.</p>
      
      <h3>The Real Value of AI in Writing</h3>
      <p>AI doesn't write your story. It handles the operational complexity so you can focus on what matters: the narrative, the characters, the world.</p>
      
      <p>Think of NeoByteWriter as your creative assistant:</p>
      <ul>
        <li>It remembers character details so you don't have to</li>
        <li>It tracks plot threads across chapters</li>
        <li>It suggests consistency fixes</li>
        <li>It organizes your world-building notes</li>
      </ul>
      
      <h3>The Human Element</h3>
      <p>Every word of prose, every emotional beat, every plot twist comes from you. The AI just removes the friction.</p>
      
      <p>Ready to try it? <a href="https://neobytewriter.vercel.app">Start creating for free</a>.</p>
    `,
    date: '2025-03-05',
    tags: ['AI Writing', 'NeoByteWriter', 'Creativity'],
    readTime: '5 min read',
    slug: 'ai-assisted-writing-tools',
  },
  {
    id: '2',
    title: 'Designing IP for Cross-Media from Day Zero',
    excerpt: 'Why we build every universe to work across books, games, and visual media simultaneously — and how that changes the creative process.',
    content: `
      <p>Traditional studios create content for one medium, then adapt it to others. Books become movies. Games get novelizations. It's an afterthought.</p>
      
      <h3>The NeoByte Approach</h3>
      <p>We design every intellectual property for cross-media from day one. A world isn't just a book — it's a game, a visual experience, a licensable universe.</p>
      
      <h3>What This Means for Creators</h3>
      <p>When you build with NeoByteStudios, you're not just writing a story. You're creating:</p>
      <ul>
        <li>A narrative foundation that works in any medium</li>
        <li>Character bibles ready for game development</li>
        <li>World maps and lore that translate to visual media</li>
        <li>IP assets that can be licensed</li>
      </ul>
      
      <p>The future of storytelling is cross-media. Start building yours today.</p>
    `,
    date: '2025-02-10',
    tags: ['Cross-Media', 'IP Design', 'Strategy'],
    readTime: '7 min read',
    slug: 'cross-media-ip-design',
  },
  {
    id: '3',
    title: 'Why the One-Person Studio Model Works',
    excerpt: 'How AI is enabling solo creators to build at the scope and quality of traditional studios — and why NeoByteStudios is betting everything on this model.',
    content: `
      <p>Five years ago, building a game studio required a team of 20+ people. Writers, designers, engineers, producers, marketers.</p>
      
      <h3>The AI Revolution</h3>
      <p>Today, one creator with the right AI tools can match that output. Not by replacing creativity, but by amplifying it.</p>
      
      <h3>The Numbers</h3>
      <p>At NeoByteStudios, we're proving this model:</p>
      <ul>
        <li>1 creator building 4 divisions</li>
        <li>AI handling operational tasks</li>
        <li>Human focused on vision and story</li>
        <li>Output rivaling traditional studios</li>
      </ul>
      
      <p>This isn't the future. This is now.</p>
    `,
    date: '2025-01-15',
    tags: ['Studio Model', 'AI', 'Solo Creator'],
    readTime: '6 min read',
    slug: 'one-person-studio-model',
  },
];

const ALL_TAGS = Array.from(
  new Set(NEWSLETTERS.flatMap(n => n.tags))
).sort();

export function NewsletterArchive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [email, setEmail] = useState('');

  // Filter newsletters
  const filteredNewsletters = NEWSLETTERS.filter(newsletter => {
    const matchesSearch = 
      newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? newsletter.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    // CLAUDE: Connect to your email service (ConvertKit, Mailchimp, etc.)
    toast.success('Subscribed! Check your inbox for confirmation.');
    setEmail('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Single newsletter view
  if (selectedNewsletter) {
    return (
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedNewsletter(null)}
            className="mb-6"
          >
            ← Back to Archive
          </Button>

          <article className="prose dark:prose-invert max-w-none">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNewsletter.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {selectedNewsletter.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedNewsletter.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedNewsletter.readTime}
              </span>
            </div>

            <div 
              className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
            />
          </article>

          {/* Newsletter signup at bottom */}
          <Card className="mt-12">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-violet-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Enjoyed this article?
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Subscribe to get the latest insights on AI-assisted creativity delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-gradient-to-r from-violet-600 to-blue-600">
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Archive list view
  return (
    <section id="newsletter" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Newsletter Archive
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Insights on AI-Assisted Creativity
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Thoughts on the one-person studio model, cross-media world-building, and the future of creative AI.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {ALL_TAGS.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Newsletter list */}
        <div className="space-y-6">
          {filteredNewsletters.map(newsletter => (
            <Card 
              key={newsletter.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedNewsletter(newsletter)}
            >
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {newsletter.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {newsletter.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {newsletter.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(newsletter.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {newsletter.readTime}
                    </span>
                  </div>

                  <Button variant="ghost" size="sm" className="text-violet-600">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNewsletters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No articles found matching your search.
            </p>
          </div>
        )}

        {/* Subscribe CTA */}
        <Card className="mt-12 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border-violet-200 dark:border-violet-800">
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-violet-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Get Updates in Your Inbox
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Subscribe to receive the latest articles on AI-assisted creativity, cross-media storytelling, and more.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-violet-600 to-blue-600">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              No spam, unsubscribe anytime. Join 2,000+ subscribers.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
