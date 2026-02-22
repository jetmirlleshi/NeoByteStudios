"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Tag,
  ArrowRight,
  BookOpen,
  Mail,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NEWSLETTERS, type NewsletterArticle } from "@/lib/constants";

export default function NewsletterArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<NewsletterArticle | null>(null);
  const [email, setEmail] = useState("");

  // Extract all unique tags from newsletters
  const allTags = useMemo(
    () => Array.from(new Set(NEWSLETTERS.flatMap((n) => n.tags))).sort(),
    []
  );

  // Filter newsletters based on search and tag
  const filteredNewsletters = NEWSLETTERS.filter((newsletter) => {
    const matchesSearch =
      newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag
      ? newsletter.tags.includes(selectedTag)
      : true;
    return matchesSearch && matchesTag;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Subscribed! Check your inbox for confirmation.");
    setEmail("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Single newsletter view
  if (selectedNewsletter) {
    return (
      <section className="section-glow-blue mesh-pattern relative py-20">

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Button
            variant="ghost"
            onClick={() => setSelectedNewsletter(null)}
            className="mb-6 text-text-secondary hover:text-text-primary"
          >
            &larr; Back to Archive
          </Button>

          <article>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNewsletter.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-brand-from/20 text-brand-from"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              {selectedNewsletter.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-text-muted mb-8">
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
              className="prose-custom text-lg text-text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: selectedNewsletter.content,
              }}
            />
          </article>

          {/* Newsletter signup at bottom */}
          <Card className="mt-12 bg-bg-card border-border-custom">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-brand-from" />
                <h3 className="font-semibold text-text-primary">
                  Enjoyed this article?
                </h3>
              </div>
              <p className="text-text-secondary mb-4">
                Subscribe to get the latest insights on AI-assisted creativity
                delivered to your inbox.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-bg-secondary border-border-custom text-text-primary placeholder:text-text-muted"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-brand-from to-brand-to text-white"
                >
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
    <section
      id="newsletter"
      className="section-glow-blue mesh-pattern relative py-20"
    >
      {/* Gradient divider at top */}
      <div className="gradient-divider absolute inset-x-0 top-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-to/10 text-brand-to text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Newsletter Archive
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Insights on AI-Assisted Creativity
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Thoughts on the one-person studio model, cross-media world-building,
            and the future of creative AI.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-bg-secondary border-border-custom text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className={cn(
                selectedTag === null
                  ? "bg-brand-from text-white"
                  : "bg-bg-secondary text-text-muted border-border-custom hover:text-text-primary"
              )}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  selectedTag === tag
                    ? "bg-brand-from/20 text-brand-from border-brand-from/30"
                    : "bg-bg-secondary text-text-muted border-border-custom hover:text-text-primary"
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Newsletter list */}
        <div className="space-y-6">
          {filteredNewsletters.map((newsletter) => (
            <Card
              key={newsletter.id}
              className="cursor-pointer bg-bg-card border border-border-custom hover:border-brand-to/30 transition-all duration-300 hover:shadow-lg"
              onClick={() => setSelectedNewsletter(newsletter)}
            >
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {newsletter.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-brand-from/20 text-brand-from"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {newsletter.title}
                </h3>

                <p className="text-text-secondary mb-4">
                  {newsletter.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(newsletter.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {newsletter.readTime}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand-from"
                  >
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
            <p className="text-text-muted">
              No articles found matching your search.
            </p>
          </div>
        )}

        {/* Subscribe CTA */}
        <Card className="mt-12 bg-gradient-to-br from-brand-from/10 to-brand-to/10 border-border-custom">
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-brand-from mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Get Updates in Your Inbox
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Subscribe to receive the latest articles on AI-assisted
              creativity, cross-media storytelling, and more.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-bg-secondary border-border-custom text-text-primary placeholder:text-text-muted"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-brand-from to-brand-to text-white"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-text-muted mt-4">
              No spam, unsubscribe anytime. Join 2,000+ subscribers.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
