"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Sparkles, Zap, Crown, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PRICING_PLANS, FAQ_ITEMS, type PricingPlan } from "@/lib/constants";

// Map iconName string from constants to actual icon component
const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Zap,
  Crown,
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const handlePlanClick = (plan: PricingPlan) => {
    if (plan.monthlyPrice === 0) {
      toast.info("Redirecting to free signup...");
    } else if (plan.name === "Studio") {
      toast.info("Opening email client...");
    } else {
      toast.info("Redirecting to checkout...");
    }
    window.open(plan.stripeLink, "_blank");
  };

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-violet-950/10 to-bg-primary" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-900/30 text-violet-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Choose Your Creative Journey
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Start free, upgrade when you need more power. No hidden fees, cancel
            anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={cn(
                "text-sm font-medium",
                !isYearly ? "text-text-primary" : "text-text-muted"
              )}
            >
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span
              className={cn(
                "text-sm font-medium",
                isYearly ? "text-text-primary" : "text-text-muted"
              )}
            >
              Yearly
            </span>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-emerald-900/30 text-emerald-300 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => {
            const IconComponent = iconMap[plan.iconName] || Sparkles;

            return (
              <Card
                key={plan.name}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-bg-card border-border-custom",
                  plan.popular
                    ? "border-2 border-violet-500 shadow-xl shadow-violet-500/20"
                    : "hover:shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-center text-sm font-medium py-1">
                    Most Popular
                  </div>
                )}

                <CardHeader className={cn("pb-4", plan.popular && "pt-10")}>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4",
                      plan.color
                    )}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-text-muted">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-text-primary">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-text-muted">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-text-muted mt-1">
                        ${Math.round(plan.yearlyPrice / 12)}/month billed
                        annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={() => handlePlanClick(plan)}
                    className={cn(
                      "w-full",
                      plan.popular
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
                        : "bg-bg-primary text-text-primary hover:bg-bg-primary/80 border border-border-custom"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-text-secondary">
              Everything you need to know about NeoByteWriter
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border-custom"
              >
                <AccordionTrigger className="text-left text-text-primary hover:text-violet-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Support CTA */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-2">Still have questions?</p>
          <a
            href="mailto:support@neobytestudios.com"
            className="inline-flex items-center gap-2 text-violet-400 font-medium hover:underline"
          >
            <HelpCircle className="w-4 h-4" />
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
