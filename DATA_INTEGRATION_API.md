# 🔗 DATA INTEGRATION & API SPECIFICATIONS

## Perplexity API & Gemini API Integration with Real-Time Data Refresh

### Complete Data Pipeline Architecture

---

## Table of Contents

1. [API Integration Overview](#api-integration-overview)
2. [Perplexity API Setup](#perplexity-api-setup)
3. [Gemini API Setup](#gemini-api-setup)
4. [Data Sources & Update Frequencies](#data-sources--update-frequencies)
5. [Real-Time Refresh System](#real-time-refresh-system)
6. [API Service Layer](#api-service-layer)
7. [Error Handling & Fallbacks](#error-handling--fallbacks)
8. [Rate Limiting & Caching](#rate-limiting--caching)
9. [Testing & Debugging](#testing--debugging)
10. [Deployment & Monitoring](#deployment--monitoring)

---

## API Integration Overview

### Primary Data Sources

**AI-Powered Data Enhancement:**
- **Perplexity API**: Real-time web search for latest odds, injury reports, lineup changes
- **Gemini API**: Advanced analytics, pattern recognition, prediction refinement

**Direct Data Sources:**
- Official lottery APIs (state-run)
- Sports statistics APIs (ESPN, NBA.com, NFL.com)
- Betting odds APIs (DraftKings, FanDuel)
- UFC Stats, FightMetric for MMA data

### Data Flow Architecture

```
┌─────────────────┐
│  User Request   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   Cache Layer (Redis)        │ ◄──── Check for recent data
└────────┬────────────────────┘
         │ (Cache Miss)
         ▼
┌─────────────────────────────┐
│  Data Integration Service    │
└────────┬────────────────────┘
         │
         ├──► Perplexity API ──► Latest news, odds, injuries
         ├──► Gemini API ──────► Analysis, predictions
         ├──► Lottery APIs ────► Drawing results
         ├──► Sports APIs ─────► Game stats, schedules
         └──► Betting APIs ────► Real-time odds
         │
         ▼
┌─────────────────────────────┐
│  PostgreSQL Database         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  ML Models (500K-1M iter)    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Prediction Response        │
└─────────────────────────────┘
```

---

## Perplexity API Setup

### Configuration

```typescript
// config/perplexity.ts
import axios from 'axios';

export const perplexityConfig = {
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseUrl: 'https://api.perplexity.ai',
  model: 'llama-3.1-sonar-large-128k-online', // Real-time web search
  timeout: 30000,
  maxRetries: 3
};

export class PerplexityService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = perplexityConfig.apiKey!;
    this.baseUrl = perplexityConfig.baseUrl;
  }

  // Search for latest sports data
  async searchSportsData(query: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: perplexityConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are a sports data analyst. Provide factual, up-to-date information with citations.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2, // Low temperature for factual responses
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: perplexityConfig.timeout
        }
      );

      return {
        content: response.data.choices[0].message.content,
        citations: response.data.citations || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Perplexity API Error:', error);
      throw new Error(`Perplexity search failed: ${error.message}`);
    }
  }

  // Get latest NCAA injury reports
  async getNCAAInjuryReports(team: string): Promise<any> {
    const query = `Latest injury report and lineup for ${team} NCAA basketball team as of ${new Date().toLocaleDateString()}`;
    return this.searchSportsData(query);
  }

  // Get latest MMA news and updates
  async getMMAFighterNews(fighter: string): Promise<any> {
    const query = `Latest news, training camp updates, and fight status for MMA fighter ${fighter} as of today`;
    return this.searchSportsData(query);
  }

  // Get current betting odds from multiple sources
  async getCurrentOdds(matchup: string, sport: string): Promise<any> {
    const query = `Current betting odds for ${matchup} in ${sport} from DraftKings, FanDuel, BetMGM as of today`;
    return this.searchSportsData(query);
  }

  // Get lottery jackpot and recent winners
  async getLotteryInfo(game: string): Promise<any> {
    const query = `Current ${game} jackpot amount and recent winning numbers from official lottery website`;
    return this.searchSportsData(query);
  }
}
```

### Usage Examples

```typescript
// Example: Get latest NCAA data
const perplexity = new PerplexityService();

const dukeInjuries = await perplexity.getNCAAInjuryReports('Duke Blue Devils');
console.log(dukeInjuries.content); // Latest injury report with citations

const fightOdds = await perplexity.getCurrentOdds('Jon Jones vs Stipe Miocic', 'UFC');
console.log(fightOdds.content); // Current odds from multiple books
```

---

## Gemini API Setup

### Configuration

```typescript
// config/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-1.5-pro-latest',
  generationConfig: {
    temperature: 0.4,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192
  }
};

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(geminiConfig.apiKey!);
    this.model = this.genAI.getGenerativeModel({ 
      model: geminiConfig.model,
      generationConfig: geminiConfig.generationConfig
    });
  }

  // Analyze historical patterns
  async analyzeHistoricalPatterns(data: any[], domain: string): Promise<any> {
    const prompt = `
      As an expert data scientist, analyze these ${domain} historical patterns:
      
      Data: ${JSON.stringify(data)}
      
      Provide:
      1. Key trends and patterns
      2. Statistical anomalies
      3. Predictive insights
      4. Confidence levels
      
      Format response as JSON.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`Gemini analysis failed: ${error.message}`);
    }
  }

  // Generate lottery number predictions
  async predictLotteryNumbers(
    historicalDraws: any[],
    game: string
  ): Promise<any> {
    const prompt = `
      Analyze ${historicalDraws.length} historical ${game} lottery draws:
      ${JSON.stringify(historicalDraws.slice(-50))} // Last 50 draws
      
      Based on frequency analysis, hot/cold numbers, and pattern recognition:
      1. Suggest 5 most likely numbers
      2. Identify hot numbers (frequently drawn recently)
      3. Identify cold numbers (overdue)
      4. Provide confidence score (0-1)
      
      Return JSON format.
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }

  // Refine sports predictions
  async refineSportsPrediction(
    modelPredictions: any[],
    recentNews: string,
    injuries: string[]
  ): Promise<any> {
    const prompt = `
      Refine these model predictions with latest context:
      
      Model Predictions: ${JSON.stringify(modelPredictions)}
      Latest News: ${recentNews}
      Injuries: ${injuries.join(', ')}
      
      Adjust win probabilities based on:
      1. Injury impact
      2. Recent team news
      3. Momentum shifts
      
      Return adjusted predictions as JSON.
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }
}
```

---

## Data Sources & Update Frequencies

### Lottery Data

| Source | Update Frequency | Method | Refresh Button |
|--------|------------------|--------|----------------|
| **Texas Lottery API** | After each drawing (Wed/Sat 9:12 PM) | HTTP GET | ✅ Manual refresh |
| **Powerball API** | After drawing (Mon/Wed/Sat 9:59 PM) | HTTP GET | ✅ Manual refresh |
| **Mega Millions API** | After drawing (Tue/Fri 10:00 PM) | HTTP GET | ✅ Manual refresh |
| **Historical Archive** | Daily at 2 AM | Batch import | ❌ Automatic only |

```typescript
// services/lottery/dataFetcher.ts
export class LotteryDataFetcher {
  // Auto-refresh after drawing times
  async autoRefreshLotteryResults() {
    const schedule = [
      { game: 'powerball', days: [1,3,6], time: '22:00' }, // Mon, Wed, Sat at 10 PM
      { game: 'megaMillions', days: [2,5], time: '22:00' }, // Tue, Fri at 10 PM
      { game: 'texasLotto', days: [3,6], time: '21:15' }  // Wed, Sat at 9:15 PM
    ];

    // Schedule auto-refresh
    schedule.forEach(item => {
      this.scheduleRefresh(item.game, item.days, item.time);
    });
  }

  // Manual refresh triggered by user button
  async manualRefresh(game: string): Promise<any> {
    console.log(`[${new Date().toISOString()}] Manual refresh requested for ${game}`);
    
    const latestData = await this.fetchLatestDrawing(game);
    await this.updateDatabase(game, latestData);
    await this.invalidateCache(game);
    
    return {
      success: true,
      data: latestData,
      timestamp: new Date().toISOString(),
      source: 'official API'
    };
  }
}
```

### NCAA Basketball Data

| Source | Update Frequency | Method | Refresh Button |
|--------|------------------|--------|----------------|
| **ESPN API** | Every 15 minutes during games | WebSocket + Polling | ✅ Live refresh |
| **NCAA.com Stats** | Every 30 minutes | HTTP GET | ✅ Manual refresh |
| **Injury Reports** | Every hour via Perplexity | AI-powered search | ✅ Manual refresh |
| **Coaching Records** | Weekly (Sunday 3 AM) | Batch update | ❌ Automatic only |

### MMA Data

| Source | Update Frequency | Method | Refresh Button |
|--------|------------------|--------|----------------|
| **UFC Stats API** | After each fight (~every 5 min during events) | WebSocket | ✅ Live refresh |
| **Fighter News (Perplexity)** | On-demand | AI search | ✅ Manual refresh |
| **Odds (Multiple
