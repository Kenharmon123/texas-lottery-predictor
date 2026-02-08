# Sports Betting Confidence Methodology

## Overview

This document explains how our confidence percentages are calculated for sports betting predictions. Every confidence percentage shown in the app is **clickable** to reveal the underlying data and methodology.

## Quick Link

**Live Implementation**: [View Confidence Breakdown](/sports/confidence)

## Confidence Score Components

Our confidence percentages (0-100%) are calculated using a weighted multi-factor model that combines:

### 1. **Odds-Based Implied Probability** (40% weight)
- Converts betting odds to probability
- **Formula**: 
  - For negative odds: `|odds| / (|odds| + 100)`
  - For positive odds: `100 / (odds + 100)`
- **Example**: -170 odds = 63% implied probability

### 2. **Value Edge Analysis** (30% weight)
- Compares our model's probability vs market odds
- **Formula**: `(Model Prob - Implied Prob) / Implied Prob`
- **Threshold**: Edges > 5% boost confidence
- **Example**: Model says 68% vs 63% implied = +7.9% edge

### 3. **Historical Performance** (15% weight)
- Team's win rate in similar matchups (last 20 games)
- Home/road performance differential
- **Data Source**: MySportsFeeds & NCAA API
- **Example**: Home team 7-3 in last 10 home games = +10% boost

### 4. **Recent Form & Momentum** (10% weight)
- Last 5 games performance trend
- Winning/losing streak impact
- **Formula**: `(Recent Wins / 5) * momentum_multiplier`
- **Example**: Team on 4-game win streak = +8% boost

### 5. **Injury Impact** (5% weight)
- Key player availability
- Position importance weighting
- **Data Source**: MySportsFeeds injury reports
- **Impact Levels**:
  - Star player out: -15% confidence
  - Starter questionable: -5% confidence
  - Bench player out: -1% confidence

## Final Confidence Calculation

```typescript
confidence = (
  (impliedProbability * 0.40) +
  (valueEdge * 0.30) +
  (historicalPerf * 0.15) +
  (recentForm * 0.10) +
  (injuryAdjustment * 0.05)
) * 100
```

## Confidence Tiers

- **90-100%**: Exceptional value, strong data consensus
- **80-89%**: High confidence, favorable indicators
- **70-79%**: Good value, positive edge detected
- **60-69%**: Moderate confidence, slight edge
- **50-59%**: Low confidence, minimal edge
- **<50%**: Not recommended

## Interactive Confidence Breakdown

### Clickable Example

When you click any confidence percentage in the app, you'll see a breakdown like:

```
🎯 Confidence: 81%

📊 Breakdown:
├─ Implied Probability: 63% (×0.40 = 25.2 points)
├─ Value Edge: +7.9% (×0.30 = 16.2 points)
├─ Historical Performance: 70% (×0.15 = 10.5 points)
├─ Recent Form: 80% (×0.10 = 8.0 points)
└─ Injury Adjustment: -5% (×0.05 = -0.9 points)

📈 Total Score: 81.0%

🔍 Supporting Data:
- Odds: New England Patriots +150 (40% implied)
- Model Probability: 48%
- Home Record: 5-2 (71%)
- Road Record (opponent): 3-4 (43%)
- Recent: 4-1 in last 5 games
- Injuries: QB Smith (Questionable, -5%)
```

## Implementation Details

### UI Component

Every confidence percentage should:
1. Be rendered as a clickable button/link
2. Have hover tooltip showing "Click for details"
3. Open modal/drawer with full breakdown
4. Display all 5 factor scores
5. Show raw data used in calculation

### Code Example

```typescript
interface ConfidenceBreakdown {
  totalConfidence: number;
  factors: {
    impliedProbability: {
      value: number;
      weight: number;
      contribution: number;
      rawData: {
        odds: string;
        impliedProb: number;
      };
    };
    valueEdge: {
      value: number;
      weight: number;
      contribution: number;
      rawData: {
        modelProb: number;
        marketProb: number;
        edge: number;
      };
    };
    // ... other factors
  };
}
```

## Data Sources

| Factor | Primary Source | Backup Source |
|--------|---------------|---------------|
| Odds & Lines | The Odds API | Manual entry |
| Team Stats | MySportsFeeds | NCAA API |
| College Stats | NCAA API | - |
| Injuries | MySportsFeeds | Team news |
| Home/Away Records | MySportsFeeds/NCAA API | Calculated |

## Best Practices

### For Users
1. **Always click the confidence %** to understand the reasoning
2. Compare multiple picks to identify strongest edges
3. Higher confidence doesn't guarantee wins - use proper bankroll management
4. Consider external factors not captured by the model (weather, motivation, etc.)

### For Developers
1. Cache confidence breakdowns to reduce API calls
2. Pre-calculate all factors during picks generation
3. Store breakdown data in database for audit trail
4. Update real-time as injury news breaks
5. Version confidence calculations for A/B testing

## API Endpoint

```typescript
GET /api/sports/confidence/:pickId

Response:
{
  "pickId": "nfl-12345",
  "confidence": 81,
  "breakdown": ConfidenceBreakdown,
  "lastUpdated": "2026-02-08T16:00:00Z",
  "factors": [...]
}
```

## Future Enhancements

- **Machine Learning Weights**: Dynamically adjust factor weights based on sport/league
- **User Customization**: Allow users to adjust weights based on their betting strategy
- **Historical Accuracy Tracking**: Show "This model is 67% accurate on 80%+ confidence picks"
- **Real-time Updates**: Recalculate as odds move or injury news breaks
- **Comparative Analysis**: Show how this pick's confidence compares to season average

## Transparency Commitment

We believe in full transparency. Every prediction includes:
- ✅ Clickable confidence scores
- ✅ Complete data sources
- ✅ Calculation methodology
- ✅ Historical accuracy rates
- ✅ No hidden algorithms

---

**Last Updated**: February 8, 2026  
**Version**: 1.0.0  
**Contact**: support@tesnillc.com
