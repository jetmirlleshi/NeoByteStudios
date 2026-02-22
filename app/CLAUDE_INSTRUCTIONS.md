# 📋 ISTRUZIONI PER CLAUDE CODE - Backend Integration

## 🎯 OBIETTIVO
Collegare il frontend NeoByteStudios a un backend funzionante con database, autenticazione, pagamenti e API.

---

## ✅ COSA È GIÀ STATO FATTO (Frontend)

Il frontend è completo al 100% con:
- React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Design responsive e moderne
- Tutti i componenti UI funzionanti
- Animazioni e transizioni
- Gestione stato locale con localStorage (per demo)

### Componenti creati:
1. **VideoHero** - Hero con video background
2. **Stats** - Statistiche animate
3. **SocialProof** - Testimonianze carosello
4. **Roadmap** - Timeline divisioni
5. **Vision** - Sezione visione
6. **Pricing** - Piani di prezzo con FAQ
7. **ReferralProgram** - Programma referral completo
8. **Countdown** - Countdown lancio
9. **NewsletterArchive** - Archivio newsletter
10. **Changelog** - Timeline aggiornamenti
11. **SmartNotifications** - Notifiche toast
12. **Footer** - Footer completo

---

## 🔧 COSA DEVI FARE (Backend)

### 1. DATABASE SETUP

**Consigliato: Supabase (PostgreSQL + Auth gratis)**

```bash
# Installa Supabase
npm install @supabase/supabase-js

# Crea progetto su https://supabase.com
# Ottieni: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Schema Database:**

```sql
-- Tabella utenti (gestita da Supabase Auth)
-- profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free', -- free, pro, studio
  referral_code TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella referral tracking
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id),
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending', -- pending, successful
  created_at TIMESTAMP DEFAULT NOW(),
  converted_at TIMESTAMP
);

-- Tabella newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- active, unsubscribed
  source TEXT, -- homepage, pricing, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella waitlist
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT,
  utm_source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella changelog (per CMS)
CREATE TABLE changelog_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- feature, improvement, bugfix
  items JSONB,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella newsletters
CREATE TABLE newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  tags TEXT[],
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. AUTENTICAZIONE

**Setup Supabase Auth:**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Crea pagine auth:**
- `/login` - Login con email/password o OAuth (Google, GitHub)
- `/signup` - Registrazione
- `/forgot-password` - Reset password
- `/auth/callback` - Callback OAuth

---

### 3. INTEGRAZIONE STRIPE (Pagamenti)

**Setup:**

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Prodotti Stripe da creare:**

| Piano | Prezzo Mensile | Prezzo Annuale | ID Prodotto |
|-------|---------------|----------------|-------------|
| Free | $0 | $0 | - |
| Pro | $9 | $90 (sconto 20%) | price_pro_monthly |
| Studio | $29 | $290 (sconto 20%) | price_studio_monthly |

**Webhook Stripe da gestire:**
- `checkout.session.completed` - Pagamento riuscito
- `invoice.paid` - Rinnovo abbonamento
- `customer.subscription.deleted` - Cancellazione

**File da creare:**
- `/api/stripe/create-checkout-session` - Crea sessione pagamento
- `/api/stripe/webhook` - Riceve eventi Stripe

---

### 4. API ENDPOINTS DA CREARE

#### Auth API
```typescript
// POST /api/auth/signup
// Body: { email, password, referralCode? }
// Response: { user, session }

// POST /api/auth/login
// Body: { email, password }
// Response: { user, session }

// POST /api/auth/logout
// Response: { success }

// POST /api/auth/reset-password
// Body: { email }
// Response: { success }
```

#### Waitlist API
```typescript
// POST /api/waitlist/join
// Body: { email, referralCode?, utmSource? }
// Response: { success, position }
// NOTA: Integra con VideoHero.tsx (riga 50) e Countdown.tsx
```

#### Referral API
```typescript
// POST /api/referrals/invite
// Body: { email }
// Headers: { Authorization: Bearer TOKEN }
// Response: { success, referralId }
// NOTA: Integra con ReferralProgram.tsx (riga 145)

// GET /api/referrals/stats
// Headers: { Authorization: Bearer TOKEN }
// Response: { totalReferrals, successfulReferrals, rewardsEarned, history }
// NOTA: Integra con ReferralProgram.tsx (riga 35)

// POST /api/referrals/track-signup
// Body: { referralCode, newUserId }
// Response: { success }
// NOTA: Chiamato quando nuovo utente si registra con codice referral
```

#### Newsletter API
```typescript
// POST /api/newsletter/subscribe
// Body: { email, source? }
// Response: { success }
// NOTA: Integra con NewsletterArchive.tsx (riga 145)

// GET /api/newsletter/articles
// Query: { tag?, search?, page? }
// Response: { articles[], total }
// NOTA: Integra con NewsletterArchive.tsx (riga 95)

// GET /api/newsletter/articles/:slug
// Response: { article }
// NOTA: Integra con NewsletterArchive.tsx (riga 115)
```

#### Changelog API
```typescript
// GET /api/changelog
// Response: { entries[], upcoming[] }
// NOTA: Integra con Changelog.tsx (riga 85)

// POST /api/changelog/notify (admin)
// Body: { email }
// Response: { success }
// NOTA: Integra con Changelog.tsx (riga 180)
```

#### Stats API (Real-time)
```typescript
// GET /api/stats/live
// Response: { activeUsers, storiesCreated, wordsWritten }
// NOTA: Usa Supabase Realtime o polling
// Integra con SmartNotifications.tsx (riga 120)
```

---

### 5. INTEGRAZIONI EMAIL

**Consigliato: ConvertKit (gratis fino a 1k subscribers)**

```bash
npm install @convertkit/sdk
```

**Email da inviare:**
1. **Welcome email** - Dopo signup
2. **Waitlist confirmation** - Dopo join waitlist
3. **Referral invite** - Quando utente invita amico
4. **Newsletter** - Articoli nuovi
5. **Changelog notification** - Nuove release
6. **Payment confirmation** - Dopo acquisto

---

### 6. FILE DA MODIFICARE

#### `.env`
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ConvertKit
CONVERTKIT_API_KEY=your-api-key
CONVERTKIT_FORM_ID=your-form-id

# App
VITE_APP_URL=https://neobytestudios.com
```

#### `src/lib/supabase.ts` (DA CREARE)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const signUp = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return supabase.auth.getUser();
};
```

#### `src/lib/stripe.ts` (DA CREARE)
```typescript
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId: string, userId: string) => {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId }),
  });
  return response.json();
};
```

---

### 7. COMPONENTI DA COLLEGARE

#### VideoHero.tsx (riga 50)
```typescript
// Sostituisci il mock con:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const { error } = await supabase
    .from('waitlist')
    .insert([{ email, referral_code: refCode }]);
  
  if (error) toast.error(error.message);
  else toast.success('Welcome! Check your inbox.');
};
```

#### ReferralProgram.tsx (riga 35, 145)
```typescript
// Sostituisci localStorage con Supabase:
const fetchReferralData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id);
  setReferralData(data);
};

const inviteByEmail = async (e: React.FormEvent) => {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('referrals').insert([{
    referrer_id: user.id,
    referred_email: emailInput,
    status: 'pending'
  }]);
  // Invia email via ConvertKit API
};
```

#### Pricing.tsx (riga 95)
```typescript
const handlePlanClick = async (plan: PricingPlan) => {
  if (plan.monthlyPrice === 0) {
    router.push('/signup');
    return;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    router.push('/login?redirect=pricing');
    return;
  }
  
  const { sessionId } = await createCheckoutSession(
    isYearly ? plan.yearlyPriceId : plan.monthlyPriceId,
    user.id
  );
  
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId });
};
```

---

### 8. DEPLOYMENT

**Consigliato: Vercel (frontend) + Supabase (backend)**

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables su Vercel:**
- Aggiungi tutte le variabili da `.env`

---

### 9. TESTING

**Test da fare:**
1. ✅ Signup nuovo utente
2. ✅ Login utente esistente
3. ✅ Join waitlist
4. ✅ Invio referral
5. ✅ Checkout Stripe (usa test card: 4242 4242 4242 4242)
6. ✅ Webhook Stripe ricevuto
7. ✅ Newsletter subscription
8. ✅ Real-time stats update

---

### 10. CHECKLIST FINALE

- [ ] Database Supabase creato
- [ ] Tabelle create con RLS policies
- [ ] Auth configurato (email + OAuth)
- [ ] Stripe account configurato
- [ ] Webhook Stripe testato
- [ ] ConvertKit integrato
- [ ] API endpoints funzionanti
- [ ] Frontend collegato a backend
- [ ] Test end-to-end completati
- [ ] Deploy su Vercel

---

## 📞 SUPPORTO

Se hai domande:
1. Documentazione Supabase: https://supabase.com/docs
2. Documentazione Stripe: https://stripe.com/docs
3. Documentazione ConvertKit: https://developers.convertkit.com

---

**Buon lavoro! 🚀**
