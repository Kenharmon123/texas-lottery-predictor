// The Odds API Integration
const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4';

export interface OddsData {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

export async function getSportsOdds(sport: string = 'baseball_mlb'): Promise<OddsData[]> {
  try {
    const response = await fetch(
      `${ODDS_API_BASE_URL}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals`,      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Odds API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sports odds:', error);
    throw error;
  }
}

export async function getAvailableSports() {
  try {
    const response = await fetch(
      `${ODDS_API_BASE_URL}/sports/?apiKey=${ODDS_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Odds API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching available sports:', error);
    throw error;
  }
}
