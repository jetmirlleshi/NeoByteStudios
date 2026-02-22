import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check, Sparkles, Zap, Crown, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: React.ReactNode;
  color: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
  popular?: boolean;
  stripeLink: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-slate-500 to-slate-600',
    features: [
      '1 active project',
      'Basic character tracking',
      'World-building templates',
      '5,000 words per month',
      'Community support',
    ],
    cta: 'Get Started Free',
    stripeLink: 'https://neobytewriter.vercel.app/signup',
  },
  {
    name: 'Pro',
    description: 'For serious creators',
    monthlyPrice: 9,
    yearlyPrice: 90,
    icon: <Zap className="w-6 h-6" />,
    color: 'from-violet-500 to-violet-600',
    features: [
      'Unlimited projects',
      'Advanced AI suggestions',
      'Cloud sync across devices',
      'Unlimited words',
      'Export to PDF/EPUB',
      'Priority support',
      'Version history',
    ],
    cta: 'Start Pro Trial',
    popular: true,
    stripeLink: 'https://buy.stripe.com/pro-monthly', // CLAUDE: Update with real Stripe link
  },
  {
    name: 'Studio',
    description: 'For professional teams',
    monthlyPrice: 29,
    yearlyPrice: 290,
    icon: <Crown className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-600',
    features: [
      'Everything in Pro',
      'Multi-IP management',
      'Team collaboration (up to 5)',
      'Cross-media planning tools',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'White-label options',
    ],
    cta: 'Contact Sales',
    stripeLink: 'mailto:sales@neobytestudios.com',
  },
];

const faqs = [
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Absolutely! Pro plans come with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial and won\'t be charged.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains yours. If you cancel, you can export everything in standard formats (PDF, EPUB, JSON). Free accounts keep data for 30 days after cancellation.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If NeoByteWriter isn\'t right for you, contact support for a full refund.',
  },
  {
    question: 'Can I use NeoByteWriter for commercial projects?',
    answer: 'Yes! All plans allow commercial use. You retain 100% ownership of your intellectual property. We\'re just the tool that helps you create.',
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const handlePlanClick = (plan: PricingPlan) => {
    if (plan.monthlyPrice === 0) {
      toast.info('Redirecting to free signup...');
    } else if (plan.name === 'Studio') {
      toast.info('Opening email client...');
    } else {
      toast.info('Redirecting to checkout...');
    }
    // CLAUDE: Integrate with Stripe checkout here
    window.open(plan.stripeLink, '_blank');
  };

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-violet-50/30 to-slate-50 dark:from-slate-950 dark:via-violet-950/10 dark:to-slate-950" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Creative Journey
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Start free, upgrade when you need more power. No hidden fees, cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              Yearly
            </span>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'border-2 border-violet-500 shadow-xl shadow-violet-500/20'
                  : 'border border-slate-200 dark:border-slate-700 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-center text-sm font-medium py-1">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`pb-4 ${plan.popular ? 'pt-10' : ''}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
              </CardHeader>

              <CardContent>
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Everything you need to know about NeoByteWriter
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Support CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Still have questions?
          </p>
          <a
            href="mailto:support@neobytestudios.com"
            className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-medium hover:underline"
          >
            <HelpCircle className="w-4 h-4" />
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
