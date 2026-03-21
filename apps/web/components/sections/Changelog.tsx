"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Rocket,
  Sparkles,
  Bug,
  Zap,
  Calendar,
  Check,
  Clock,
  ArrowRight,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CHANGELOG,
  UPCOMING_FEATURES,
  type ChangelogEntry,
  type UpcomingFeature,
} from "@/lib/constants";

// Map entry.type to config: icon, label, colors
const typeConfig: Record<
  ChangelogEntry["type"],
  { label: string; color: string; icon: React.ElementType }
> = {
  feature: {
    label: "Feature",
    color: "bg-brand-from/20 text-brand-from",
    icon: Rocket,
  },
  improvement: {
    label: "Improvement",
    color: "bg-brand-to/20 text-brand-to",
    icon: Zap,
  },
  bugfix: {
    label: "Bug Fix",
    color: "bg-accent/20 text-accent",
    icon: Bug,
  },
  breaking: {
    label: "Breaking Change",
    color: "bg-red-900/30 text-red-300",
    icon: Sparkles,
  },
};

// Map item.type to colors
const itemTypeConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-brand-from" },
  improved: { label: "Improved", color: "bg-brand-to" },
  fixed: { label: "Fixed", color: "bg-accent" },
};

// Map status to colors
const statusConfig: Record<
  UpcomingFeature["status"],
  { label: string; color: string }
> = {
  planned: { label: "Planned", color: "bg-bg-secondary text-text-muted" },
  "in-progress": {
    label: "In Progress",
    color: "bg-amber-900/30 text-amber-300",
  },
  beta: { label: "Beta", color: "bg-brand-from/20 text-brand-from" },
};

export default function Changelog() {
  const [showNotificationSignup, setShowNotificationSignup] = useState(false);
  const [email, setEmail] = useState("");

  const handleNotificationSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("You'll be notified about new releases!");
    setEmail("");
    setShowNotificationSignup(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section
      id="changelog"
      className="section-glow-violet mesh-pattern relative py-20 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-from/10 text-brand-from text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            Changelog
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            What&apos;s New at NeoByteStudios
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Track our progress as we build the future of AI-assisted creativity.
          </p>

          {/* Notification CTA */}
          <Button
            variant="outline"
            className="mt-6 border-border-custom text-text-secondary hover:text-text-primary"
            onClick={() => setShowNotificationSignup(!showNotificationSignup)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Get Release Notifications
          </Button>
        </div>

        {/* Notification signup card (toggleable) */}
        {showNotificationSignup && (
          <Card className="mb-8 bg-bg-card border-border-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">
                  Get Notified About New Releases
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotificationSignup(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  &times;
                </Button>
              </div>
              <form
                onSubmit={handleNotificationSignup}
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
        )}

        {/* Coming Soon - Upcoming Features */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-from" />
            Coming Soon
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {UPCOMING_FEATURES.map((feature, index) => (
              <Card
                key={index}
                className="border-dashed border-2 bg-bg-card border-border-custom"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-text-primary">
                      {feature.title}
                    </h4>
                    <Badge className={cn("text-xs", statusConfig[feature.status].color)}>
                      {statusConfig[feature.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Calendar className="w-3 h-3" />
                    ETA: {feature.eta}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Release History Timeline */}
        <div className="relative">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Check className="w-5 h-5 text-accent" />
            Release History
          </h3>

          {/* Timeline line */}
          <div className="absolute left-4 top-16 bottom-0 w-px bg-gradient-to-b from-brand-from via-brand-to to-accent" />

          <div className="space-y-8">
            {CHANGELOG.map((entry) => {
              const typeInfo = typeConfig[entry.type];
              const TypeIcon = typeInfo.icon;

              return (
                <div key={entry.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-2 top-1 w-5 h-5 rounded-full border-4 border-bg-primary",
                      entry.type === "feature"
                        ? "bg-brand-from"
                        : entry.type === "improvement"
                          ? "bg-brand-to"
                          : entry.type === "bugfix"
                            ? "bg-accent"
                            : "bg-red-500"
                    )}
                  />

                  <Card className="bg-bg-card border border-border-custom">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className={cn("text-xs", typeInfo.color)}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {typeInfo.label}
                        </Badge>
                        <span className="font-mono text-sm text-text-muted">
                          {entry.version}
                        </span>
                        <span className="text-sm text-text-muted">
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-text-primary mb-2">
                        {entry.title}
                      </h4>
                      <p className="text-text-secondary mb-4">
                        {entry.description}
                      </p>

                      {/* Items */}
                      <ul className="space-y-2">
                        {entry.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Badge
                              className={cn(
                                "text-white text-xs flex-shrink-0 mt-0.5",
                                itemTypeConfig[item.type].color
                              )}
                            >
                              {itemTypeConfig[item.type].label}
                            </Badge>
                            <span className="text-sm text-text-secondary">
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
          <p className="text-text-secondary mb-4">
            Want to see the code behind NeoByteStudios?
          </p>
          <a
            href="https://github.com/jetmirlleshi/NeoByteStudios"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="border-border-custom text-text-secondary hover:text-text-primary"
            >
              View on GitHub
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
