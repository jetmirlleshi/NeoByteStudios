"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Gift,
  Share2,
  Copy,
  Check,
  Users,
  Trophy,
  Link2,
  Mail,
  Twitter,
  Facebook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { REWARDS } from "@/lib/constants";

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  rewardsEarned: number;
  referralHistory: {
    email: string;
    date: string;
    status: "pending" | "successful";
  }[];
}

export default function ReferralProgram() {
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: "",
    totalReferrals: 0,
    successfulReferrals: 0,
    rewardsEarned: 0,
    referralHistory: [],
  });
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Generate or retrieve referral code from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("neobyte_referral_data");
    if (stored) {
      setReferralData(JSON.parse(stored));
      setIsLoading(false);
    } else {
      const code = generateReferralCode();
      const newData: ReferralData = {
        referralCode: code,
        totalReferrals: 0,
        successfulReferrals: 0,
        rewardsEarned: 0,
        referralHistory: [],
      };
      setReferralData(newData);
      localStorage.setItem("neobyte_referral_data", JSON.stringify(newData));
      setIsLoading(false);
    }
  }, []);

  const generateReferralCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "NB";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const referralLink = `https://neobytestudios.com/?ref=${referralData.referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(
      "Join me on NeoByteStudios - AI-powered creativity"
    );
    const body = encodeURIComponent(
      `Hey!\n\nI thought you'd love NeoByteStudios - it's an AI-powered creative studio for building cross-media worlds.\n\nUse my referral link to get started:\n${referralLink}\n\nCheers!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Just discovered @NeoByteStudios - AI-powered creative studio for building cross-media worlds!\n\nJoin with my link: ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(referralLink);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const inviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newHistory = [
      ...referralData.referralHistory,
      {
        email: emailInput,
        date: new Date().toISOString(),
        status: "pending" as const,
      },
    ];

    const updatedData = {
      ...referralData,
      totalReferrals: referralData.totalReferrals + 1,
      referralHistory: newHistory,
    };

    setReferralData(updatedData);
    localStorage.setItem("neobyte_referral_data", JSON.stringify(updatedData));
    setEmailInput("");
    toast.success(`Invitation sent to ${emailInput}!`);
  };

  const getNextReward = () => {
    return (
      REWARDS.find((r) => r.referrals > referralData.successfulReferrals) ||
      REWARDS[REWARDS.length - 1]
    );
  };

  const getProgressToNext = () => {
    const next = getNextReward();
    const prev = REWARDS[REWARDS.indexOf(next) - 1];
    const prevCount = prev ? prev.referrals : 0;
    const progress =
      ((referralData.successfulReferrals - prevCount) /
        (next.referrals - prevCount)) *
      100;
    return Math.min(progress, 100);
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-pulse text-text-muted">Loading...</div>
        </div>
      </section>
    );
  }

  const nextReward = getNextReward();
  const progress = getProgressToNext();

  return (
    <section
      id="referral"
      className="section-glow-accent mesh-pattern relative py-20 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Referral Program
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Share the Love, Earn Rewards
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Invite your friends to NeoByteStudios and earn free Pro access. The
            more you share, the more you earn!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="text-center bg-bg-card border-border-custom">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent mb-1">
                {referralData.totalReferrals}
              </div>
              <div className="text-sm text-text-muted">Total Invites</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-bg-card border-border-custom">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent mb-1">
                {referralData.successfulReferrals}
              </div>
              <div className="text-sm text-text-muted">Successful</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-bg-card border-border-custom">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent mb-1">
                {referralData.rewardsEarned}
              </div>
              <div className="text-sm text-text-muted">Rewards Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to next reward */}
        <Card className="mb-8 bg-bg-card border-border-custom">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-brand-from" />
                <div>
                  <p className="font-medium text-text-primary">
                    Next Reward: {nextReward.reward}
                  </p>
                  <p className="text-sm text-text-muted">
                    {referralData.successfulReferrals} / {nextReward.referrals}{" "}
                    referrals
                  </p>
                </div>
              </div>
              <span className="text-2xl">{nextReward.icon}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Referral Link */}
        <Card className="mb-8 bg-bg-card border-border-custom">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Link2 className="w-5 h-5 text-brand-from" />
              Your Referral Link
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  value={referralLink}
                  readOnly
                  className="h-12 pr-24 font-mono text-sm bg-bg-secondary border-border-custom text-text-primary"
                />
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={shareViaEmail}
                className="bg-bg-secondary hover:bg-bg-card border-border-custom text-text-secondary hover:text-text-primary"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                className="bg-bg-secondary hover:bg-bg-card border-border-custom text-text-secondary hover:text-text-primary"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnFacebook}
                className="bg-bg-secondary hover:bg-bg-card border-border-custom text-text-secondary hover:text-text-primary"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invite by email */}
        <Card className="mb-8 bg-bg-card border-border-custom">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-from" />
              Invite by Email
            </h3>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={inviteByEmail}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="email"
                placeholder="friend@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-12 bg-bg-secondary border-border-custom text-text-primary placeholder:text-text-muted"
              />
              <Button
                type="submit"
                className="h-12 bg-gradient-to-r from-brand-from to-brand-to text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Send Invite
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Rewards Table */}
        <Card className="bg-bg-card border-border-custom">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Gift className="w-5 h-5 text-brand-from" />
              Reward Tiers
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {REWARDS.map((reward, index) => {
                const isAchieved =
                  referralData.successfulReferrals >= reward.referrals;
                const isNext = nextReward.referrals === reward.referrals;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl",
                      isAchieved
                        ? "bg-accent/10 border border-accent/30"
                        : isNext
                          ? "bg-brand-from/10 border border-brand-from/30"
                          : "bg-bg-secondary"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isAchieved
                              ? "text-accent"
                              : "text-text-primary"
                          )}
                        >
                          {reward.reward}
                        </p>
                        <p className="text-sm text-text-muted">
                          {reward.referrals} successful referrals
                        </p>
                      </div>
                    </div>
                    {isAchieved && (
                      <Check className="w-5 h-5 text-accent" />
                    )}
                    {isNext && !isAchieved && (
                      <span className="text-xs font-medium text-brand-from bg-brand-from/10 px-2 py-1 rounded-full">
                        Next
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        {referralData.referralHistory.length > 0 && (
          <Card className="mt-8 bg-bg-card border-border-custom">
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-from" />
                Recent Invites
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {referralData.referralHistory
                  .slice(-5)
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-from/20 flex items-center justify-center text-brand-from text-sm font-medium">
                          {item.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-text-secondary">
                          {item.email}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          item.status === "successful"
                            ? "bg-accent/10 text-accent"
                            : "bg-amber-900/30 text-amber-300"
                        )}
                      >
                        {item.status === "successful" ? "Joined" : "Pending"}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
