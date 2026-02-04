import { NextRequest, NextResponse } from 'next/server';
import { SportsAnalyticsEngine } from '@/engines/SportsAnalyticsEngine';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get('sport');
    const homeTeam = searchParams.get('homeTeam');
    const awayTeam = searchParams.get('awayTeam');
    
    if (!sport || !homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: 'Sport, homeTeam, and awayTeam are required' },
        { status: 400 }
      );
    }

    const engine = new SportsAnalyticsEngine();
    const prediction = await engine.predictGame({
      sport: sport as any,
      homeTeam,
      awayTeam
    });

    return NextResponse.json({
      success: true,
      sport,
      matchup: `${homeTeam} vs ${awayTeam}`,
      prediction,
      timestamp: new Date().toISOString(),
      note: 'AI-powered prediction with real-time analytics'
    });
    
  } catch (error) {
    console.error('Sports prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate sports prediction' },
      { status: 500 }
    );
  }
}

// POST endpoint for detailed predictions with custom data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sport, homeTeam, awayTeam, teamStats } = body;
    
    if (!sport || !homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: 'Sport, homeTeam, and awayTeam are required' },
        { status: 400 }
      );
    }

    const engine = new SportsAnalyticsEngine();
    const prediction = await engine.predictGame({
      sport,
      homeTeam,
      awayTeam,
      customStats: teamStats
    });

    return NextResponse.json({
      success: true,
      prediction
    });
    
  } catch (error) {
    console.error('Sports prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}
