// Lottery Data API Integration
const LOTTERY_API_KEY = process.env.LOTTERY_API_KEY;

export interface LotteryDrawing {
  game: string;
  drawDate: string;
  winningNumbers: number[];
  megaBall?: number;
  powerBall?: number;
  jackpot: string;
}

export interface LotteryGame {
  name: string;
  id: string;
  type: 'daily' | 'weekly' | 'multistate';
}

// Texas Lottery Games
export const TEXAS_LOTTERY_GAMES: LotteryGame[] = [
  { name: 'Powerball', id: 'powerball', type: 'multistate' },
  { name: 'Mega Millions', id: 'mega-millions', type: 'multistate' },
  { name: 'Lotto Texas', id: 'lotto-texas', type: 'weekly' },
  { name: 'Texas Two Step', id: 'texas-two-step', type: 'weekly' },
  { name: 'Cash Five', id: 'cash-five', type: 'daily' },
  { name: 'Daily 4', id: 'daily-4', type: 'daily' },
  { name: 'Pick 3', id: 'pick-3', type: 'daily' },
];

export async function getLotteryDrawings(gameId: string, limit: number = 10): Promise<LotteryDrawing[]> {
  try {
    // Note: Using a placeholder endpoint - update with actual lottery data API
    const response = await fetch(
      `https://api.example.com/lottery/${gameId}?apiKey=${LOTTERY_API_KEY}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Lottery API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lottery drawings:', error);
    // Return mock data for development
    return getMockLotteryData(gameId, limit);
  }
}

// Mock data for development
function getMockLotteryData(gameId: string, limit: number): LotteryDrawing[] {
  const mockDrawings: LotteryDrawing[] = [];
  const today = new Date();

  for (let i = 0; i < limit; i++) {
    const drawDate = new Date(today);
    drawDate.setDate(today.getDate() - i * 3);

    mockDrawings.push({
      game: gameId,
      drawDate: drawDate.toISOString().split('T')[0],
      winningNumbers: Array.from({ length: 5 }, () => Math.floor(Math.random() * 69) + 1),
      powerBall: Math.floor(Math.random() * 26) + 1,
      jackpot: `$${Math.floor(Math.random() * 500) + 100}M`,
    });
  }

  return mockDrawings;
}

export async function getHistoricalData(gameId: string, years: number = 10) {
  try {
    const response = await fetch(
      `https://api.example.com/lottery/${gameId}/history?years=${years}&apiKey=${LOTTERY_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Lottery API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}
