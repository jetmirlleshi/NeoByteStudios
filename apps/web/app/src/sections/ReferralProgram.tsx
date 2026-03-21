import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Gift, Share2, Copy, Check, Users, Trophy, Link2, Mail, Twitter, Facebook } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  rewardsEarned: number;
  referralHistory: {
    email: string;
    date: string;
    status: 'pending' | 'successful';
  }[];
}

const REWARDS = [
  { referrals: 1, reward: '1 Month Pro Free', icon: '🎁' },
  { referrals: 3, reward: '3 Months Pro Free', icon: '🚀' },
  { referrals: 5, reward: '6 Months Pro Free', icon: '👑' },
  { referrals: 10, reward: 'Lifetime Pro Access', icon: '💎' },
];

export function ReferralProgram() {
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    totalReferrals: 0,
    successfulReferrals: 0,
    rewardsEarned: 0,
    referralHistory: [],
  });
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Generate or retrieve referral code
  useEffect(() => {
    const stored = localStorage.getItem('neobyte_referral_data');
    if (stored) {
      setReferralData(JSON.parse(stored));
      setIsLoading(false);
    } else {
      // Generate new referral code
      const code = generateReferralCode();
      const newData: ReferralData = {
        referralCode: code,
        totalReferrals: 0,
        successfulReferrals: 0,
        rewardsEarned: 0,
        referralHistory: [],
      };
      setReferralData(newData);
      localStorage.setItem('neobyte_referral_data', JSON.stringify(newData));
      setIsLoading(false);
    }
  }, []);

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NB';
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
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join me on NeoByteStudios - AI-powered creativity');
    const body = encodeURIComponent(
      `Hey!\n\nI thought you'd love NeoByteStudios - it's an AI-powered creative studio for building cross-media worlds.\n\nUse my referral link to get started:\n${referralLink}\n\nCheers!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Just discovered @NeoByteStudios - AI-powered creative studio for building cross-media worlds! 🚀\n\nJoin with my link: ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(referralLink);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const inviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    // CLAUDE: Connect to your backend API to send invitation email
    // POST /api/referrals/invite
    // { email: emailInput, referralCode: referralData.referralCode }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newHistory = [
      ...referralData.referralHistory,
      { email: emailInput, date: new Date().toISOString(), status: 'pending' as const },
    ];

    const updatedData = {
      ...referralData,
      totalReferrals: referralData.totalReferrals + 1,
      referralHistory: newHistory,
    };

    setReferralData(updatedData);
    localStorage.setItem('neobyte_referral_data', JSON.stringify(updatedData));
    setEmailInput('');
    toast.success(`Invitation sent to ${emailInput}!`);
  };

  const getNextReward = () => {
    return REWARDS.find(r => r.referrals > referralData.successfulReferrals) || REWARDS[REWARDS.length - 1];
  };

  const getProgressToNext = () => {
    const next = getNextReward();
    const prev = REWARDS[REWARDS.indexOf(next) - 1];
    const prevCount = prev ? prev.referrals : 0;
    const progress = ((referralData.successfulReferrals - prevCount) / (next.referrals - prevCount)) * 100;
    return Math.min(progress, 100);
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  const nextReward = getNextReward();
  const progress = getProgressToNext();

  return (
    <section id="referral" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-emerald-950/20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Referral Program
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Share the Love, Earn Rewards
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Invite your friends to NeoByteStudios and earn free Pro access. 
            The more you share, the more you earn!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold gradient-text mb-1">
                {referralData.totalReferrals}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Total Invites
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold gradient-text mb-1">
                {referralData.successfulReferrals}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Successful
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold gradient-text mb-1">
                {referralData.rewardsEarned}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Rewards Earned
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to next reward */}
        <Card className="mb-8 border-violet-200 dark:border-violet-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-violet-500" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Next Reward: {nextReward.reward}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {referralData.successfulReferrals} / {nextReward.referrals} referrals
                  </p>
                </div>
              </div>
              <span className="text-2xl">{nextReward.icon}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Referral Link */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-violet-500" />
              Your Referral Link
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  value={referralLink}
                  readOnly
                  className="h-12 pr-24 font-mono text-sm bg-slate-50 dark:bg-slate-800"
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
              <Button variant="outline" size="sm" onClick={shareViaEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnTwitter}>
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnFacebook}>
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invite by email */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-violet-500" />
              Invite by Email
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={inviteByEmail} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-12"
              />
              <Button type="submit" className="h-12 bg-gradient-to-r from-violet-600 to-blue-600">
                <Share2 className="w-4 h-4 mr-2" />
                Send Invite
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Rewards Table */}
        <Card>
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-violet-500" />
              Reward Tiers
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {REWARDS.map((reward, index) => {
                const isAchieved = referralData.successfulReferrals >= reward.referrals;
                const isNext = nextReward.referrals === reward.referrals;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      isAchieved
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                        : isNext
                        ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800'
                        : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <p className={`font-medium ${
                          isAchieved ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'
                        }`}>
                          {reward.reward}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {reward.referrals} successful referrals
                        </p>
                      </div>
                    </div>
                    {isAchieved && (
                      <Check className="w-5 h-5 text-emerald-500" />
                    )}
                    {isNext && (
                      <span className="text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded-full">
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
          <Card className="mt-8">
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-500" />
                Recent Invites
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {referralData.referralHistory.slice(-5).reverse().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-sm font-medium">
                        {item.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.email}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'successful'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    }`}>
                      {item.status === 'successful' ? 'Joined' : 'Pending'}
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
