# 🚀 REAL DATA API SETUP GUIDE

## Quick Start: Get Your Free API Keys in 15 Minutes

This guide provides **direct links and step-by-step instructions** to get all necessary API keys for real sports and lottery data.

---

## 📊 API Services Overview

| Service | Purpose | Cost | Setup Time | Free Tier |
|---------|---------|------|------------|----------|
| **The Odds API** | Sports betting odds, live games | **FREE** | 5 min | 500 requests/month |
| **Google Gemini** | AI analytics & predictions | **FREE** | 3 min | 1500 requests/day |
| **Lottery APIs** | Texas Lottery, Powerball, Mega Millions | **FREE** | 5 min | Varies |
| **Supabase** | Database (already set up) | **FREE** | Done ✅ | 500MB storage |

---

## 1️⃣ THE ODDS API (Sports Betting Data)

### What It Provides:
- ✅ Real-time odds from 80+ bookmakers
- ✅ NFL, NBA, MLB, NHL, MMA/UFC, Soccer
- ✅ Spreads, Moneyline, Over/Under, Player Props
- ✅ Live in-game betting data

### Setup Instructions:

**🔗 Step 1: Visit The Odds API**
```
https://the-odds-api.com
```

**📝 Step 2: Click "Get API Key" (blue button on homepage)**

**📧 Step 3: Enter your email address**
- Use: kenharmon123@gmail.com (or your preferred email)
- You'll receive your API key instantly via email

**⚙️ Step 4: Copy your API key and save it**

**🎁 Free Tier Includes:**
- 500 requests per month
- Access to all sports
- Real-time odds updates
- No credit card required

---

## 2️⃣ GOOGLE GEMINI API (AI Analytics)

### What It Provides:
- ✅ Advanced pattern recognition
- ✅ Predictive analytics
- ✅ Historical data analysis
- ✅ 1 million token context window

### Setup Instructions:

**🔗 Step 1: Visit Google AI Studio**
```
https://aistudio.google.com/app/apikey
```

**🌐 Step 2: Sign in with Google Account**
- Use your Gmail account (kenharmon123@gmail.com)

**🔑 Step 3: Click "Create API Key"**
- Select "Create API key in new project" or use existing
- Name it: "Texas Lottery Predictor"

**💾 Step 4: Copy your API key**
- Format: `AIzaSy...` (starts with AIza)
- Save it securely

**🎁 Free Tier Includes:**
- 1,500 requests per day
- Gemini 1.5 Flash model
- No credit card required
- 1 million tokens per request

---

## 3️⃣ LOTTERY DATA APIS

### Option A: Texas Lottery Official (Recommended)

**🔗 API Endpoint:**
```
https://www.texaslottery.com/export/sites/lottery/Games/Lotto_Texas/Winning_Numbers/lotto_texas.html
```

**No API Key Required** - Public data scraping allowed

### Option B: LotteryData.io (Enhanced Features)

**🔗 Step 1: Visit LotteryData.io**
```
https://www.lotterydata.io
```

**📝 Step 2: Sign up for Free Plan**
- 50 requests/month free
- Real-time Powerball & Mega Millions data
- Historical winning numbers

### Option C: APIVerve Lottery API

**🔗 Step 1: Visit APIVerve**
```
https://apiverve.com/marketplace/lottery
```

**📝 Step 2: Sign up for free account**
- 100 free credits/month
- Powerball, Mega Millions, Texas Lotto
- JSON format responses

---

## 4️⃣ SUPABASE DATABASE (Already Set Up! ✅)

Your Supabase credentials are already configured:
- **URL**: `xstdmpfyrxejutcpqvfp.supabase.co`
- **API Keys**: Already in Vercel environment variables

No action needed - we'll use these for storing historical data.

---

## 🔐 ADDING API KEYS TO VERCEL

Once you have your API keys, follow these steps:

### Step-by-Step:

**1. Go to Vercel Project Settings**
```
https://vercel.com/ken-harmons-projects/texas-lottery-predictor/settings/environment-variables
```

**2. Add each environment variable:**

Click "Add New" and enter:

```env
Name: ODDS_API_KEY
Value: [paste your The Odds API key]
Environment: Production, Preview, Development
```

```env
Name: GEMINI_API_KEY  
Value: [paste your Gemini API key]
Environment: Production, Preview, Development
```

```env
Name: LOTTERY_API_KEY
Value: [paste your LotteryData.io key if using]
Environment: Production, Preview, Development
```

**3. Click "Save" for each one**

**4. Redeploy your app** (Vercel will auto-redeploy)

---

## 📋 VERIFICATION CHECKLIST

Before implementation, verify you have:

- [ ] The Odds API key (email confirmation received)
- [ ] Google Gemini API key (starts with AIza)
- [ ] Lottery API access (choose one option)
- [ ] Added all keys to Vercel environment variables
- [ ] Triggered a new deployment

---

## 🎯 NEXT STEPS

Once you provide the API keys, I will:

1. ✅ Create data fetcher services for each API
2. ✅ Implement caching layer to optimize requests
3. ✅ Replace all mock data with real API calls
4. ✅ Add error handling and fallbacks
5. ✅ Create database schema in Supabase
6. ✅ Deploy and test with live data

---

## 💡 HELPFUL TIPS

### Rate Limit Management:
- **The Odds API**: 500 requests/month = ~16/day
- **Strategy**: Cache odds for 15 minutes, refresh only when user requests
- **Gemini API**: 1,500 requests/day = plenty for predictions

### Cost Optimization:
- All services offer generous free tiers
- Implementation includes smart caching
- No credit card required for any service
- Can upgrade later if traffic grows

### Security:
- Never commit API keys to GitHub
- Always use environment variables
- Keys are encrypted in Vercel

---

## 🆘 NEED HELP?

If you need assistance getting any API key:

1. **The Odds API Issues**: Email support@the-odds-api.com
2. **Gemini API Issues**: Check https://ai.google.dev/gemini-api/docs
3. **Vercel Environment Variables**: See https://vercel.com/docs/projects/environment-variables

---

## 📚 ADDITIONAL RESOURCES

Found on GitHub (for reference):

**Lottery Prediction Examples:**
- https://github.com/idanshimon/powerball_ai
- https://github.com/Ahmad-Alam/Lottery-Prediction
- https://github.com/KN4KNG/LotteryNumberPredictor

**Sports Betting Examples:**
- https://github.com/georgedouzas/sports-betting
- https://github.com/roswelly/sport-betting-api
- https://github.com/NearHuscarl/the-odds-api

---

## ✅ READY TO IMPLEMENT!

Once you have the API keys, paste them here and I'll:
1. Add them to Vercel
2. Implement all data fetchers
3. Deploy with real data
4. Test everything end-to-end

**No coding required on your end - just provide the keys!**
