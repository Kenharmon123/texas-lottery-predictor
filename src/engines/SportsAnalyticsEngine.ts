import * as tf from '@tensorflow/tfjs';
export type SportType = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'SOCCER' | 'MMA';

export interface TeamStats {
  wins: number;
  losses: number;
  avgPointsScored: number;
  avgPointsAllowed: number;
  homeRecord: string;
  awayRecord: string;
  streak: string;
  injuries: string[];
  lastGames: number[];
}

export interface OverUnderPrediction {
  line: number;
  prediction: 'OVER' | 'UNDER';
  confidence: number;
  projectedTotal: number;
  analysis: string;
}

export interface FinalScorePrediction {
  homeScore: number;
  awayScore: number;
  winner: 'HOME' | 'AWAY' | 'PUSH';
  confidence: number;
  margin: number;
}

export interface SportsPrediction {
  sport: SportType;
  homeTeam: string;
  awayTeam: string;
  overUnder: OverUnderPrediction;
  finalScore: FinalScorePrediction;
  spreadPrediction: {
    line: number;
    pick: 'HOME' | 'AWAY';
    confidence: number;
  };
  keyFactors: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
}

export class SportsAnalyticsEngine {
  private model: tf.LayersModel | null = null;
  private historicalGames: Map<SportType, any[]> = new Map();

  constructor() {
    this.initializeModel();
  }

  private async initializeModel(): Promise<void> {
    // Deep learning model for sports predictions
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 256, activation: 'relu' }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'linear' }) // [home_score, away_score, total]
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse']
    });
  }

  public async train(sport: SportType, games: any[]): Promise<void> {
    this.historicalGames.set(sport, games);
    
    if (games.length < 20) {
      console.warn(`Insufficient data for ${sport} training`);
      return;
    }

    const features = games.map(g => this.extractFeatures(g));
    const labels = games.map(g => [g.homeScore, g.awayScore, g.homeScore + g.awayScore]);

    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    await this.model?.fit(xs, ys, {
      epochs: 150,
      batchSize: 16,
      validationSplit: 0.15,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 25 === 0) {
            console.log(`${sport} Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
          }
        }
      }
    });

    xs.dispose();
    ys.dispose();
  }

  public async predict(
    sport: SportType,
    homeTeam: string,
    awayTeam: string,
    homeStats: TeamStats,
    awayStats: TeamStats,
    oddsLine?: { spread: number; overUnder: number }
  ): Promise<SportsPrediction> {
    // Generate predictions
    const finalScore = await this.predictFinalScore(sport, homeStats, awayStats);
    const overUnder = this.predictOverUnder(sport, finalScore, oddsLine?.overUnder);
    const spread = this.predictSpread(finalScore, oddsLine?.spread || 0);
    const keyFactors = this.analyzeKeyFactors(sport, homeStats, awayStats);
    const riskLevel = this.assessRiskLevel(finalScore.confidence, overUnder.confidence);
    const recommendations = this.generateRecommendations(sport, finalScore, overUnder, spread, riskLevel);

    return {
      sport,
      homeTeam,
      awayTeam,
      overUnder,
      finalScore,
      spreadPrediction: spread as any,
      keyFactors,
      riskLevel,
      recommendations
    };
  }

  private async predictFinalScore(sport: SportType, homeStats: TeamStats, awayStats: TeamStats): Promise<FinalScorePrediction> {
    let homeScore: number;
    let awayScore: number;
    let confidence = 0.70;

    if (this.model && this.historicalGames.has(sport)) {
      const features = this.extractMatchupFeatures(homeStats, awayStats);
      const input = tf.tensor2d([features]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const scores = await prediction.data();
      
      homeScore = Math.round(scores[0]);
      awayScore = Math.round(scores[1]);
      
      input.dispose();
      prediction.dispose();
      
      confidence = 0.82;
    } else {
      // Statistical fallback
      homeScore = Math.round(homeStats.avgPointsScored * 1.05 - awayStats.avgPointsAllowed * 0.45);
      awayScore = Math.round(awayStats.avgPointsScored * 0.95 - homeStats.avgPointsAllowed * 0.45);
    }

    // Apply sport-specific adjustments
        [homeScore, awayScore] = this.applySportAdjustments(sport, homeScore, awayScore);

    const winner = homeScore > awayScore ? 'HOME' : awayScore > homeScore ? 'AWAY' : 'PUSH';
    const margin = Math.abs(homeScore - awayScore);

    return {
      homeScore,
      awayScore,
      winner,
      confidence,
      margin
    };
  }

  private predictOverUnder(sport: SportType, finalScore: FinalScorePrediction, line?: number): OverUnderPrediction {
    const projectedTotal = finalScore.homeScore + finalScore.awayScore;
    const standardLine = line || this.getStandardOverUnder(sport);
    
    const difference = projectedTotal - standardLine;
    const prediction = difference > 0 ? 'OVER' : 'UNDER';
    
    // Confidence based on how far from the line
    let confidence = Math.min(0.95, 0.65 + Math.abs(difference) * 0.02);
    
    const analysis = this.generateOverUnderAnalysis(sport, projectedTotal, standardLine, difference);

    return {
      line: standardLine,
      prediction,
      confidence,
      projectedTotal,
      analysis
    };
  }

  private predictSpread(finalScore: FinalScorePrediction, line: number) {
    const projectedSpread = finalScore.homeScore - finalScore.awayScore;
    const pick = projectedSpread > line ? 'HOME' : 'AWAY';
    const confidence = Math.min(0.90, 0.70 + Math.abs(projectedSpread - line) * 0.03);

    return { line, pick, confidence };
  }

  private extractFeatures(game: any): number[] {
    return [
      game.homeWins || 0,
      game.homeLosses || 0,
      game.awayWins || 0,
      game.awayLosses || 0,
      game.homeAvgPoints || 0,
      game.awayAvgPoints || 0,
      game.homeDefense || 0,
      game.awayDefense || 0,
      game.homeForm || 0,
      game.awayForm || 0,
      game.injuries || 0,
      game.restDays || 0,
      game.weather || 0,
      game.homeAdvantage || 1,
      game.rivalry || 0,
      game.playoff || 0,
      game.streak || 0,
      game.momentum || 0,
      game.coaching || 0,
      game.specialTeams || 0
    ];
  }

  private extractMatchupFeatures(home: TeamStats, away: TeamStats): number[] {
    return [
      home.wins, home.losses,
      away.wins, away.losses,
      home.avgPointsScored, away.avgPointsScored,
      home.avgPointsAllowed, away.avgPointsAllowed,
      this.calculateForm(home.lastGames),
      this.calculateForm(away.lastGames),
      home.injuries.length, away.injuries.length,
      1, // rest days
      0, // weather
      1.05, // home advantage
      0, // rivalry
      0, // playoff
      this.parseStreak(home.streak),
      this.parseStreak(away.streak),
      0, // coaching
      0  // special teams
    ];
  }

  private this.applySportAdjustments(sport, homeScore, awayScore)sport: SportType, homeScore: number, awayScore: number): [number, number] {
    switch (sport) {
      case 'NFL':
        // NFL typically 17-35 points
        homeScore = Math.max(10, Math.min(45, homeScore));
        awayScore = Math.max(10, Math.min(45, awayScore));
        break;
      case 'NBA':
        // NBA typically 95-130 points
        homeScore = Math.max(85, Math.min(140, homeScore));
        awayScore = Math.max(85, Math.min(140, awayScore));
        break;
      case 'MLB':
        // MLB typically 2-8 runs
        homeScore = Math.max(0, Math.min(12, homeScore));
        awayScore = Math.max(0, Math.min(12, awayScore));
        break;
      case 'NHL':
        // NHL typically 2-6 goals
        homeScore = Math.max(0, Math.min(8, homeScore));
        awayScore = Math.max(0, Math.min(8, awayScore));
        break;
      case 'SOCCER':
        // Soccer typically 0-4 goals
        homeScore = Math.max(0, Math.min(5, homeScore));
        awayScore = Math.max(0, Math.min(5, awayScore));
        break;
      case 'MMA':
        // MMA rounds won (usually 3 or 5 rounds)
        homeScore = Math.max(0, Math.min(5, homeScore));
        awayScore = Math.max(0, Math.min(5, awayScore));
        break;
    }

    return [homeScore, awayScore];
  }

  private getStandardOverUnder(sport: SportType): number {
    const defaults: Record<SportType, number> = {
      NFL: 47.5,
      NBA: 220.5,
      MLB: 8.5,
      NHL: 6.5,
      SOCCER: 2.5,
      MMA: 2.5
    };
    return defaults[sport];
  }

  private generateOverUnderAnalysis(sport: SportType, projected: number, line: number, diff: number): string {
    const direction = diff > 0 ? 'OVER' : 'UNDER';
    const confidence = diff > 0 ? 'strong' : 'moderate';
    return `Projected total ${projected.toFixed(1)} vs line ${line} suggests ${confidence} ${direction} by ${Math.abs(diff).toFixed(1)} points`;
  }

  private analyzeKeyFactors(sport: SportType): string[] {
    const factors: string[] = [];

    if (homeStats.injuries.length > 2) {
      factors.push(`Home team dealing with ${homeStats.injuries.length} injuries`);
    }
    if (awayStats.injuries.length > 2) {
      factors.push(`Away team dealing with ${awayStats.injuries.length} injuries`);
    }

    const homeMomentum = this.calculateForm(homeStats.lastGames);
    const awayMomentum = this.calculateForm(awayStats.lastGames);

    if (homeMomentum > 0.7) factors.push('Home team on hot streak');
    if (awayMomentum > 0.7) factors.push('Away team on hot streak');
    if (homeMomentum < 0.3) factors.push('Home team struggling recently');
    if (awayMomentum < 0.3) factors.push('Away team struggling recently');

    factors.push(`Home advantage factor: ~5% boost`);

    if (homeStats.avgPointsScored > homeStats.avgPointsAllowed + 5) {
      factors.push('Home offense significantly outperforms defense');
    }

    return factors;
  }

  private assessRiskLevel(scoreCon: number, overUnderCon: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    const avgConfidence = (scoreCon + overUnderCon) / 2;
    if (avgConfidence >= 0.80) return 'LOW';
    if (avgConfidence >= 0.65) return 'MEDIUM';
    return 'HIGH';
  }

  private generateRecommendations(
    sport: SportType,
    finalScore: FinalScorePrediction,
    overUnder: OverUnderPrediction,
    spread: any,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'LOW') {
      recommendations.push('High confidence prediction - consider for betting');
    } else if (riskLevel === 'HIGH') {
      recommendations.push('High risk prediction - proceed with caution');
    }

    if (overUnder.confidence > 0.80) {
      recommendations.push(`Strong ${overUnder.prediction} recommendation on O/U ${overUnder.line}`);
    }

    if (finalScore.margin > 10) {
      recommendations.push(`Large predicted margin of ${finalScore.margin} points`);
    } else if (finalScore.margin <= 3) {
      recommendations.push('Close game predicted - high variance possible');
    }

    if (spread.confidence > 0.85) {
      recommendations.push(`Take ${spread.pick} against spread`);
    }

    recommendations.push('Always bet responsibly - never wager more than you can afford to lose');
    recommendations.push(`${sport} predictions based on statistical analysis and AI models`);

    return recommendations;
  }

  private calculateForm(lastGames: number[]): number {
    if (!lastGames || lastGames.length === 0) return 0.5;
    const wins = lastGames.filter(result => result > 0).length;
    return wins / lastGames.length;
  }

  private parseStreak(streak: string): number {
    if (!streak) return 0;
    const match = streak.match(/(W|L)(\d+)/);
    if (!match) return 0;
    const isWin = match[1] === 'W';
    const count = parseInt(match[2]);
    return isWin ? count : -count;
  }

  public dispose(): void {
    this.model?.dispose();
    this.historicalGames.clear();
  }
}
