import { NextRequest, NextResponse } from 'next/server';

// Player Prop Prediction Engine for DraftKings
export interface PlayerPropPrediction {
  playerId: string;
  playerName: string;
  team: string;
  position: string;
  sport: string;
  props: PropPrediction[];
  confidence: number;
  lastGames: GameStats[];
}

export interface PropPrediction {
  category: string; // 'points', 'rebounds', 'assists', 'yards', 'touchdowns', etc.
  prediction: number;
  overUnder: {
    line: number;
    recommendation: 'OVER' | 'UNDER';
    confidence: number;
    edge: number; // percentage edge over line
  };
  range: {
    low: number;
    high: number;
    avg: number;
  };
}

export interface GameStats {
  date: string;
  opponent: string;
  stats: Record<string, number>;
}

export interface GameTotalsPrediction {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  totals: {
    predictedTotal: number;
    overUnderLine: number;
    recommendation: 'OVER' | 'UNDER';
    confidence: number;
    homeScore: number;
    awayScore: number;
  };
  spread: {
    line: number;
    recommendation: string;
    confidence: number;
  };
}

// Sample player data generator (in production, this comes from real APIs)
const generatePlayerStats = (sport: string, position: string): GameStats[] => {
  const games: GameStats[] = [];
  const opponents = ['LAL', 'BOS', 'MIA', 'PHX', 'DEN', 'GSW', 'MIL', 'DAL', 'PHI', 'NYK'];
  
  for (let i = 0; i < 10; i++) {
    const stats: Record<string, number> = {};
    
    if (sport === 'NBA') {
      if (position === 'PG' || position === 'SG') {
        stats.points = Math.floor(Math.random() * 15) + 15; // 15-30
        stats.assists = Math.floor(Math.random() * 8) + 4; // 4-12
        stats.rebounds = Math.floor(Math.random() * 4) + 2; // 2-6
        stats.threes = Math.floor(Math.random() * 4) + 1; // 1-5
      } else if (position === 'SF' || position === 'PF') {
        stats.points = Math.floor(Math.random() * 12) + 18; // 18-30
        stats.rebounds = Math.floor(Math.random() * 6) + 6; // 6-12
        stats.assists = Math.floor(Math.random() * 4) + 2; // 2-6
      } else { // Center
        stats.points = Math.floor(Math.random() * 10) + 15; // 15-25
        stats.rebounds = Math.floor(Math.random() * 8) + 8; // 8-16
        stats.blocks = Math.floor(Math.random() * 3) + 1; // 1-4
      }
      stats.minutes = Math.floor(Math.random() * 8) + 30; // 30-38
    } else if (sport === 'NFL') {
      if (position === 'QB') {
        stats.passingYards = Math.floor(Math.random() * 100) + 220; // 220-320
        stats.passingTDs = Math.floor(Math.random() * 3) + 1; // 1-4
        stats.interceptions = Math.floor(Math.random() * 2); // 0-2
      } else if (position === 'RB') {
        stats.rushingYards = Math.floor(Math.random() * 60) + 60; // 60-120
        stats.rushingTDs = Math.floor(Math.random() * 2); // 0-2
        stats.receptions = Math.floor(Math.random() * 5) + 2; // 2-7
      } else if (position === 'WR' || position === 'TE') {
        stats.receptions = Math.floor(Math.random() * 5) + 4; // 4-9
        stats.receivingYards = Math.floor(Math.random() * 60) + 60; // 60-120
        stats.receivingTDs = Math.floor(Math.random() * 2); // 0-2
      }
    }
    
    games.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0],
      opponent: opponents[i % opponents.length],
      stats
    });
  }
  
  return games;
};

const calculatePropPredictions = (stats: GameStats[], sport: string): PropPrediction[] => {
  const props: PropPrediction[] = [];
  
  // Get all stat categories
  const categories = new Set<string>();
  stats.forEach(game => Object.keys(game.stats).forEach(key => categories.add(key)));
  
  categories.forEach(category => {
    const values = stats.map(game => game.stats[category] || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const low = sorted[0];
    const high = sorted[sorted.length - 1];
    
    // Calculate trend (more weight to recent games)
    let weightedSum = 0;
    let weightSum = 0;
    values.forEach((val, idx) => {
      const weight = Math.pow(0.9, idx); // More recent = higher weight
      weightedSum += val * weight;
      weightSum += weight;
    });
    const prediction = weightedSum / weightSum;
    
    // Simulated DraftKings line
    const line = Math.round(avg * 10) / 10;
    const edge = ((prediction - line) / line) * 100;
    
    props.push({
      category,
      prediction: Math.round(prediction * 10) / 10,
      overUnder: {
        line,
        recommendation: prediction > line ? 'OVER' : 'UNDER',
        confidence: Math.min(95, 50 + Math.abs(edge) * 5),
        edge: Math.abs(edge)
      },
      range: {
        low,
        high,
        avg: Math.round(avg * 10) / 10
      }
    });
  });
  
  return props;
};

// GET endpoint for player prop predictions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerId = searchParams.get('playerId');
    const playerName = searchParams.get('playerName');
    const team = searchParams.get('team');
    const position = searchParams.get('position') || 'PG';
    const sport = searchParams.get('sport') || 'NBA';
    
    if (!playerName) {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      );
    }

    // Generate historical stats
    const lastGames = generatePlayerStats(sport, position);
    
    // Calculate predictions
    const props = calculatePropPredictions(lastGames, sport);
    
    // Calculate overall confidence based on consistency
    const consistency = props.reduce((sum, prop) => {
      const range = prop.range.high - prop.range.low;
      const consistency = 100 - Math.min(100, (range / prop.range.avg) * 50);
      return sum + consistency;
    }, 0) / props.length;

    const prediction: PlayerPropPrediction = {
      playerId: playerId || `player_${Date.now()}`,
      playerName,
      team: team || 'UNK',
      position,
      sport,
      props,
      confidence: Math.round(consistency),
      lastGames: lastGames.slice(0, 5) // Return last 5 games
    };

    return NextResponse.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString(),
      note: 'AI-powered player prop predictions with over/under recommendations'
    });
    
  } catch (error) {
    console.error('Player prop prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate player prop predictions' },
      { status: 500 }
    );
  }
}

// POST endpoint for bulk player predictions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { players, sport } = body;
    
    if (!players || !Array.isArray(players)) {
      return NextResponse.json(
        { error: 'Players array is required' },
        { status: 400 }
      );
    }

    const predictions = players.map(player => {
      const lastGames = generatePlayerStats(sport || 'NBA', player.position || 'PG');
      const props = calculatePropPredictions(lastGames, sport || 'NBA');
      
      const consistency = props.reduce((sum, prop) => {
        const range = prop.range.high - prop.range.low;
        return sum + (100 - Math.min(100, (range / prop.range.avg) * 50));
      }, 0) / props.length;

      return {
        playerId: player.id,
        playerName: player.name,
        team: player.team,
        position: player.position,
        sport: sport || 'NBA',
        props,
        confidence: Math.round(consistency),
        lastGames: lastGames.slice(0, 5)
      };
    });

    return NextResponse.json({
      success: true,
      predictions,
      count: predictions.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Bulk prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate bulk predictions' },
      { status: 500 }
    );
  }
}
