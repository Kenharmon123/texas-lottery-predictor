import * as tf from '@tensorflow/tfjs';
import { mean, standardDeviation } from 'simple-statistics';

export type DFSPosition = 'QB' | 'RB' | 'WR' | 'TE' | 'DST' | 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'P' | 'SP' | 'OF' | 'G' | 'D';
export type DFSSport = 'NFL' | 'NBA' | 'MLB' | 'NHL';
export type DFSContest = 'CLASSIC' | 'SHOWDOWN' | 'TIERS';

export interface PlayerStats {
  playerId: string;
  name: string;
  team: string;
  position: DFSPosition;
  salary: number;
  opponent: string;
  isHome: boolean;
  
  // Recent Performance
  last5Games: number[];
  seasonAvg: number;
  recentTrend: 'UP' | 'DOWN' | 'STABLE';
  
  // Advanced Metrics
  usageRate?: number;
  touchShare?: number;
  targetShare?: number;
  minutesPerGame?: number;
  shotsPerGame?: number;
  
  // Matchup Data
  opponentRank: number; // vs position (1=easiest, 32=hardest)
  VegasImpliedTotal?: number;
  
  // Injury/Status
  injuryStatus: 'HEALTHY' | 'QUESTIONABLE' | 'DOUBTFUL' | 'OUT';
  injuryDetails?: string;
  
  // Weather (for NFL)
  weather?: {
    temp: number;
    wind: number;
    precipitation: number;
  };
}

export interface PlayerProjection {
  player: PlayerStats;
  projectedPoints: number;
  ceiling: number;
  floor: number;
  confidence: number;
  ownership: number; // Expected % owned
  value: number; // Points per $1000
  factors: string[];
}

export interface OptimalLineup {
  players: PlayerProjection[];
  totalSalary: number;
  projectedPoints: number;
  avgOwnership: number;
  stackInfo?: string;
  leverage: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string[];
}

export interface LineupConstraints {
  sport: DFSSport;
  contest: DFSContest;
  maxSalary: number;
  positions: Record<string, number>;
  minPlayers?: number;
  maxPlayers?: number;
  stackPreference?: 'QB_STACK' | 'RB_STACK' | 'GAME_STACK' | 'NONE';
  uniqueness?: number; // 0-100, how different from the field
}

export class DraftKingsFantasyEngine {
  private model: tf.LayersModel | null = null;
  private playerDatabase: Map<string, PlayerStats[]> = new Map();

  constructor() {
    this.initializeModel();
  }

  private async initializeModel(): Promise<void> {
    // AI model for player projections
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [15], units: 128, activation: 'relu' }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.25 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'linear' }) // [projection, ceiling, floor]
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'huber',
      metrics: ['mae']
    });
  }

  public async projectPlayer(player: PlayerStats, _sport: DFSSport): Promise<PlayerProjection> {
    const baseProjection = this.calculateBaseProjection(player, _sport);
    const matchupAdjustment = this.applyMatchupAdjustment(player, baseProjection);
    const trendAdjustment = this.applyTrendAdjustment(player, matchupAdjustment);
    
    let projectedPoints = trendAdjustment;
    let ceiling = projectedPoints * 1.5;
    let floor = projectedPoints * 0.5;
    let confidence = 0.70;

    // AI Enhancement
    if (this.model && player.last5Games.length >= 5) {
      const features = this.extractPlayerFeatures(player, sport);
      const input = tf.tensor2d([features]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const [aiProj, aiCeiling, aiFloor] = await prediction.data();
      
      // Blend AI with statistical
      projectedPoints = (projectedPoints * 0.6) + (aiProj * 0.4);
      ceiling = Math.max(ceiling, aiCeiling);
      floor = Math.min(floor, aiFloor);
      confidence = 0.82;
      
      input.dispose();
      prediction.dispose();
    }

    // Adjust for injury
    if (player.injuryStatus !== 'HEALTHY') {
      projectedPoints *= player.injuryStatus === 'QUESTIONABLE' ? 0.85 : 0.5;
      confidence *= 0.7;
    }

    const value = (projectedPoints / player.salary) * 1000;
    const ownership = this.estimateOwnership(player, value, sport);
    const factors = this.identifyKeyFactors(player, projectedPoints, sport);

    return {
      player,
      projectedPoints: Math.round(projectedPoints * 10) / 10,
      ceiling: Math.round(ceiling * 10) / 10,
      floor: Math.round(floor * 10) / 10,
      confidence,
      ownership,
      value: Math.round(value * 10) / 10,
      factors
    };
  }

  public async generateOptimalLineup(
    availablePlayers: PlayerStats[],
    constraints: LineupConstraints
  ): Promise<OptimalLineup[]> {
    // Project all players
    const projections: PlayerProjection[] = [];
    for (const player of availablePlayers) {
      if (player.injuryStatus !== 'OUT') {
        const proj = await this.projectPlayer(player, constraints.sport);
        projections.push(proj);
      }
    }

    // Generate multiple lineups
    const lineups: OptimalLineup[] = [];
    
    // Core lineup (highest projected)
    const coreLineup = this.buildLineup(projections, constraints, 'PROJ');
    if (coreLineup) lineups.push(coreLineup);

    // Value lineup (best value plays)
    const valueLineup = this.buildLineup(projections, constraints, 'VALUE');
    if (valueLineup) lineups.push(valueLineup);

    // Contrarian lineup (low ownership)
    const contrarianLineup = this.buildLineup(projections, constraints, 'CONTRARIAN');
    if (contrarianLineup) lineups.push(contrarianLineup);

    // Tournament lineup (high ceiling)
    const tournamentLineup = this.buildLineup(projections, constraints, 'CEILING');
    if (tournamentLineup) lineups.push(tournamentLineup);

    return lineups;
  }

  private calculateBaseProjection(player: PlayerStats, _sport: DFSSport): number {
    if (player.last5Games.length === 0) return player.seasonAvg;
    
    const recentAvg = mean(player.last5Games);
    const seasonWeight = 0.3;
    const recentWeight = 0.7;
    
    return (player.seasonAvg * seasonWeight) + (recentAvg * recentWeight);
  }

  private applyMatchupAdjustment(player: PlayerStats, baseProj: number): number {
    // Easier matchup = boost, harder = penalize
    const matchupFactor = 1 + ((17 - player.opponentRank) / 100); // 0.84 to 1.16
    return baseProj * matchupFactor;
  }

  private applyTrendAdjustment(player: PlayerStats, projection: number): number {
    switch (player.recentTrend) {
      case 'UP':
        return projection * 1.08;
      case 'DOWN':
        return projection * 0.92;
      default:
        return projection;
    }
  }

  private extractPlayerFeatures(player: PlayerStats, _sport: DFSSport): number[] {
    return [
      player.salary / 10000,
      player.seasonAvg,
      mean(player.last5Games),
      player.opponentRank / 32,
      player.usageRate || 0.2,
      player.minutesPerGame || 30,
      player.recentTrend === 'UP' ? 1 : player.recentTrend === 'DOWN' ? -1 : 0,
      player.isHome ? 1 : 0,
      player.VegasImpliedTotal || 24,
      player.touchShare || 0.15,
      player.targetShare || 0.15,
      player.last5Games[player.last5Games.length - 1] || 0,
      standardDeviation(player.last5Games),
      player.injuryStatus === 'HEALTHY' ? 1 : 0.5,
      player.weather?.wind || 0
    ];
  }

  private estimateOwnership(player: PlayerStats, value: number, _sport: DFSSport): number {
    let baseOwnership = 5; // Start at 5%
    
    // High salary = higher ownership
    if (player.salary > 8000) baseOwnership += 10;
    if (player.salary > 9000) baseOwnership += 15;
    
    // Good value = higher ownership
    if (value > 5) baseOwnership += 10;
    if (value > 6) baseOwnership += 15;
    
    // Good matchup = higher ownership
    if (player.opponentRank <= 5) baseOwnership += 10;
    
    // Stars = higher ownership
    if (player.seasonAvg > 20 && sport !== 'NFL') baseOwnership += 15;
    
    return Math.min(baseOwnership, 50); // Cap at 50%
  }

  private identifyKeyFactors(player: PlayerStats, projection: number, _sport: DFSSport): string[] {
    const factors: string[] = [];

    if (player.recentTrend === 'UP') {
      factors.push('🔥 Hot streak - trending up');
    }

    if (player.opponentRank <= 5) {
      factors.push('✅ Elite matchup - top 5 easiest');
    } else if (player.opponentRank >= 28) {
      factors.push('⚠️ Tough matchup - top 5 hardest');
    }

    const value = (projection / player.salary) * 1000;
    if (value > 6) {
      factors.push('💎 Exceptional value - 6+ pts/$1K');
    } else if (value > 5) {
      factors.push('💰 Great value - 5+ pts/$1K');
    }

    if (player.usageRate && player.usageRate > 0.30) {
      factors.push('📊 High usage rate - 30%+ team offense');
    }

    if (player.isHome) {
      factors.push('🏠 Home game advantage');
    }

    if (player.VegasImpliedTotal && player.VegasImpliedTotal > 28) {
      factors.push('🎯 High scoring game environment');
    }

    if (player.injuryStatus === 'QUESTIONABLE') {
      factors.push('⚕️ Injury concern - monitor status');
    }

    if (projection > player.seasonAvg * 1.2) {
      factors.push('🚀 Smash spot - 20%+ above season average');
    }

    return factors;
  }

  private buildLineup(
    projections: PlayerProjection[],
    constraints: LineupConstraints,
    strategy: 'PROJ' | 'VALUE' | 'CONTRARIAN' | 'CEILING'
  ): OptimalLineup | null {
    // Sort by strategy
    const sorted = [...projections].sort((a, b) => {
      switch (strategy) {
        case 'VALUE':
          return b.value - a.value;
        case 'CONTRARIAN':
          return a.ownership - b.ownership;
        case 'CEILING':
          return b.ceiling - a.ceiling;
        default:
          return b.projectedPoints - a.projectedPoints;
      }
    });

    // Greedy algorithm with position constraints
    const lineup: PlayerProjection[] = [];
    let totalSalary = 0;
    const positionsFilled: Record<string, number> = {};

    for (const proj of sorted) {
      const pos = proj.player.position;
      const needed = constraints.positions[pos] || 0;
      const filled = positionsFilled[pos] || 0;

      if (filled < needed && totalSalary + proj.player.salary <= constraints.maxSalary) {
        lineup.push(proj);
        totalSalary += proj.player.salary;
        positionsFilled[pos] = filled + 1;

        // Check if lineup complete
        const totalNeeded = Object.values(constraints.positions).reduce((a, b) => a + b, 0);
        if (lineup.length === totalNeeded) break;
      }
    }

    if (lineup.length < Object.values(constraints.positions).reduce((a, b) => a + b, 0)) {
      return null; // Couldn't build valid lineup
    }

    const projectedPoints = lineup.reduce((sum, p) => sum + p.projectedPoints, 0);
    const avgOwnership = mean(lineup.map(p => p.ownership));
    const leverage = avgOwnership < 15 ? 'HIGH' : avgOwnership < 25 ? 'MEDIUM' : 'LOW';

    const reasoning = [
      `Strategy: ${strategy}`,
      `Total Salary: $${totalSalary.toLocaleString()} / $${constraints.maxSalary.toLocaleString()}`,
      `Projected: ${projectedPoints.toFixed(1)} points`,
      `Avg Ownership: ${avgOwnership.toFixed(1)}%`,
      `Leverage: ${leverage}`
    ];

    return {
      players: lineup,
      totalSalary,
      projectedPoints: Math.round(projectedPoints * 10) / 10,
      avgOwnership: Math.round(avgOwnership * 10) / 10,
      leverage,
      reasoning
    };
  }

  public dispose(): void {
    this.model?.dispose();
    this.playerDatabase.clear();
  }
}
