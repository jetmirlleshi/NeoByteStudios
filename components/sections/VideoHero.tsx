"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SITE } from "@/lib/constants";
import {
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  Play,
  ChevronDown,
  Globe,
  Cpu,
  User,
} from "lucide-react";
import Link from "next/link";

const VIDEO_URL =
  "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4";

const TRUST_BADGES = [
  { icon: Globe, label: "Cross-Media IP" },
  { icon: Cpu, label: "AI-Enhanced" },
  { icon: User, label: "One-Person Studio" },
];

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleWaitlist = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to join waitlist");

      toast.success("You're on the list! We'll be in touch.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#0d0d1a] via-bg-primary to-bg-primary">
      {/* ── Video Background ─────────────────────────────────── */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* ── Dark Gradient Overlay ────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-bg-primary" />

      {/* ── Particle Effects Overlay ─────────────────────────── */}
      <div className="particles-container" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 5) % 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${12 + (i % 5) * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ── Mute Toggle ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-6 right-6 z-30 rounded-full bg-bg-card/60 backdrop-blur-sm border border-border-custom p-3 text-text-primary transition-colors hover:bg-bg-card"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border-custom bg-bg-card/60 backdrop-blur-sm px-4 py-1.5 text-sm text-text-secondary">
            <Sparkles className="h-4 w-4 text-accent" />
            AI-Powered Creative Studio
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mt-8 font-display text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="gradient-text">{SITE.name}</span>
          <br />
          <span className="text-text-primary">Where AI Meets Imagination</span>
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl animate-fade-in"
          style={{ animationDelay: "0.35s" }}
        >
          One creator, AI-amplified. Building universes that span books, games,
          and visual media.
        </p>

        {/* CTA Buttons */}
        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-to-r from-brand-from to-brand-to text-white hover:opacity-90 px-8 py-3 text-base"
          >
            <Link href="https://neobytewriter.vercel.app" target="_blank" rel="noopener noreferrer">
              Start Creating Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-border-custom bg-bg-card/40 backdrop-blur-sm text-text-primary hover:bg-bg-card/60 px-8 py-3 text-base"
          >
            <Play className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        {/* Email Capture */}
        <form
          onSubmit={handleWaitlist}
          className="mx-auto mt-10 flex max-w-md items-center gap-2 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <Input
            type="email"
            placeholder="Enter your email for early access"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-full border-border-custom bg-bg-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-gradient-to-r from-brand-from to-brand-to text-white hover:opacity-90 px-6"
          >
            {isSubmitting ? "Joining..." : "Join"}
          </Button>
        </form>

        {/* Trust Badges */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-text-muted text-sm"
            >
              <badge.icon className="h-4 w-4 text-accent" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-fade-in"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
