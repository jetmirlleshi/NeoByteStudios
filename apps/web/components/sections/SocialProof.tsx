"use client";

import { useRef } from "react";
import { TESTIMONIALS } from "@/lib/constants";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const TRUST_METRICS = [
  { value: "4.9/5", label: "Average Rating" },
  { value: "500+", label: "Active Users" },
  { value: "50K+", label: "Stories Created" },
];

export default function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="section-glow-blue mesh-pattern relative py-20 md:py-28"
      aria-label="Testimonials from creators"
    >
      <div className="relative mx-auto max-w-6xl px-4">
        {/* ── Section Header ─────────────────────────────────── */}
        <div className="mb-12 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-border-custom bg-bg-card/60 backdrop-blur-sm px-4 py-1.5 text-sm text-text-secondary mb-6">
            <Star className="h-4 w-4 text-amber-400" />
            Early Adopter Reviews
          </span>

          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            Loved by Creators Worldwide
          </h2>
        </div>

        {/* ── Carousel Container ─────────────────────────────── */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-custom bg-bg-card p-2 text-text-primary shadow-lg transition-colors hover:bg-bg-card/80 md:-left-6"
            aria-label="Scroll testimonials left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-custom bg-bg-card p-2 text-text-primary shadow-lg transition-colors hover:bg-bg-card/80 md:-right-6"
            aria-label="Scroll testimonials right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 py-2"
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="w-[320px] flex-shrink-0 snap-center rounded-2xl border border-border-custom bg-bg-card p-6 transition-all duration-300 hover:border-brand-to/30"
              >
                {/* Quote Icon */}
                <Quote className="mb-4 h-8 w-8 text-brand-from" />

                {/* Star Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar with gradient circle and initials */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-brand-to text-sm font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust Indicators ───────────────────────────────── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {TRUST_METRICS.map((metric) => (
            <div key={metric.label} className="text-center">
              <span className="gradient-text block font-display text-2xl font-bold md:text-3xl">
                {metric.value}
              </span>
              <span className="text-xs text-text-muted">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
