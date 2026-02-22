"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, ArrowRight, Users, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { LAUNCH_DATE } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-xl mb-2">
        <span className="text-3xl sm:text-4xl font-bold text-white">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-text-muted uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = LAUNCH_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("You're on the list! We'll notify you when we launch.");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section id="countdown" className="py-20 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-blue-900 to-emerald-900">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+\")",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge
              variant="outline"
              className="px-4 py-2 bg-white/10 border-white/20 text-white/90"
            >
              <Sparkles className="w-4 h-4 mr-2 text-violet-300" />
              Coming Soon
            </Badge>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Our first universe is being forged.
          </h2>
          <p className="text-lg text-white/70 text-center mb-10 max-w-xl mx-auto">
            A fantasy world born from the collaboration between human
            imagination and artificial intelligence.
            <span className="text-emerald-400 font-medium"> Coming 2026.</span>
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-3 sm:gap-6 mb-12">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <CountdownUnit value={timeLeft.minutes} label="Min" />
            <CountdownUnit value={timeLeft.seconds} label="Sec" />
          </div>

          {/* Waitlist form */}
          <div className="max-w-md mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <Bell className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 text-base rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-violet-400 focus:bg-white/20"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-6 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  <>
                    Join the Waitlist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-2 mt-4 text-white/60">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                <span className="font-semibold text-white">2,847</span> people
                already joined
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { label: "Early Access", desc: "Be the first to explore" },
                {
                  label: "Exclusive Updates",
                  desc: "Behind-the-scenes content",
                },
                {
                  label: "Founder Perks",
                  desc: "Special rewards at launch",
                },
              ].map((benefit, index) => (
                <div key={index}>
                  <div className="font-medium text-white mb-1">
                    {benefit.label}
                  </div>
                  <div className="text-sm text-white/60">{benefit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
