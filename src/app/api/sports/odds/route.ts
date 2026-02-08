import { NextRequest, NextResponse } from 'next/server';
import { getSportsOdds } from '@/lib/oddsApi';

// Map of sport names to The Odds API sport keys
const SPORT_KEYS: { [key: string]: string } = {
  'NFL': 'americanfootball_nfl',
  'NBA': 'basketball_nba',
  'MLB': 'baseball_mlb',
  'NHL': 'icehockey_nhl',
  'SOCCER': 'soccer_epl', // English Premier League as default
  'MMA': 'mma_mixed_martial_arts',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get('sport') || 'ALL';
    
    // If requesting all sports, fetch multiple leagues
    if (sport === 'ALL') {
      const promises = Object.values(SPORT_KEYS).map(sportKey => 
        getSportsOdds(sportKey).catch(() => [])
      );
      
      const results = await Promise.all(promises);
      const allOdds = results.flat();
      
      return NextResponse.json({
        success: true,
        data: allOdds,
        count: allOdds.length,
      });
    }
    
    // Fetch specific sport
    const sportKey = SPORT_KEYS[sport];
    if (!sportKey) {
      return NextResponse.json(
        { error: 'Invalid sport. Valid options: NFL, NBA, MLB, NHL, SOCCER, MMA' },
        { status: 400 }
      );
    }
    
    const odds = await getSportsOdds(sportKey);
    
    return NextResponse.json({
      success: true,
      sport,
      data: odds,
      count: odds.length,
    });
  } catch (error) {
    console.error('Error fetching sports odds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sports odds' },
      { status: 500 }
    );
  }
}
