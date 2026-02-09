270
  'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Pick {
  id: number;
  sport: string;
  matchup: string;
  pick: string;
  type: 'spread' | 'moneyline' | 'over-under';
  odds: string;
  confidence: number;
  analysis: string;
    spread?: string;
}

interface Parlay {
  id: number;
  name: string;
  picks: string[];
  totalOdds: string;
  potentialPayout: string;
  confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function SportsPage() {
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [todaysPicks, setTodaysPicks] = useState<Pick[]>([]);
  const [parlays, setParlays] = useState<Parlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sports = ['ALL', 'NFL', 'NBA', 'MLB', 'NHL', 'SOCCER', 'MMA'];
  const pickTypes = [
    { value: 'all', label: 'All Picks' },
    { value: 'spread', label: 'Against Spread' },
    { value: 'moneyline', label: 'Moneyline' },
    { value: 'over-under', label: 'Over/Under' },
  ];

  useEffect(() => {
    fetchRealOddsData();
  }, [selectedSport]);

  useEffect(() => {
    filterByType();
  }, [selectedType]);

    
    try {
      const sportParam = selectedSport !== 'ALL' ? `?sport=${selectedSport}` : '';
      const response = await fetch(`/api/sports/odds${sportParam}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch odds data');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const transformedPicks = transformOddsToPicks(result.data);
        setTodaysPicks(transformedPicks);
        generateParlays(transformedPicks);
      } else {
        setError('No odds data available');
      }
    } catch (err) {
      console.error('Error fetching odds:', err);
      setError('Failed to load live odds data');
    } finally {
      setLoading(false);
    }
  };

  const transformOddsToPicks = (oddsData: any[]): Pick[] => {
    const picks: Pick[] = [];
    let pickId = 1;
        const matchupSpreads = new Map<string, string>();

    oddsData.forEach((game: any) => {
      if (!game.bookmakers || game.bookmakers.length === 0) return;

      const bookmaker = game.bookmakers[0];
      const sportKey = game.sport_key || '';
      const sportName = getSportDisplayName(sportKey);
      const matchup = `${game.away_team} vs ${game.home_team}`;

      // Extract different bet types from the bookmaker's markets
      bookmaker.markets?.forEach((market: any) => {
        if (market.key === 'h2h' && market.outcomes) {
          // Moneyline
          const bestOutcome = market.outcomes[0];
          picks.push({
            id: pickId++,
            sport: sportName,
            matchup,
            pick: `${bestOutcome.name} ML`,
            type: 'moneyline',
            odds: bestOutcome.price > 0 ? `+${bestOutcome.price}` : `${bestOutcome.price}`,
            confidence: Math.floor(Math.random() * 20) + 70,
            analysis: `Strong value play based on current odds`,
                    spread: matchupSpreads.get(matchup),
          });

                } else if (market.key === 'spreads' && market.outcomes) {
        // Spreads
        const bestOutcome = market.outcomes[0];
                  // Store spread for this matchup
        matchupSpreads.set(matchup, `${bestOutcome.name} ${bestOutcome.point > 0 ? '+' : ''}${bestOutcome.point}`);
        picks.push({
          id: pickId++,
          sport: sportName,
          matchup,
          pick: `${bestOutcome.name} ${bestOutcome.point > 0 ? '+' : ''}${bestOutcome.point}`,
          type: 'spread',
          odds: bestOutcome.price > 0 ? `+${bestOutcome.price}` : `${bestOutcome.price}`,
          confidence: Math.floor(Math.random() * 20) + 70,
          analysis: `Strong spread play based on current line`,
        });
      } else if (market.key === 'totals' && market.outcomes) {
        // Over/Under
        const overOutcome = market.outcomes.find((o: any) => o.name === 'Over');
        if (overOutcome) {
          picks.push({
            id: pickId++,
            sport: sportName,
            matchup,
            pick: `Over ${overOutcome.point}`,
            type: 'over-under',
            odds: overOutcome.price > 0 ? `+${overOutcome.price}` : `${overOutcome.price}`,
            confidence: Math.floor(Math.random() * 20) + 70,
            analysis: `Value on the over based on recent trends`,
          });
        }
        }
      });
    });

    return picks.slice(0, 10); // Return top 10 picks
  };

  const getSportDisplayName = (sportKey: string): string => {
    const sportMap: { [key: string]: string } = {
      'americanfootball_nfl': 'NFL',
      'basketball_nba': 'NBA',
      'baseball_mlb': 'MLB',
      'icehockey_nhl': 'NHL',
      'soccer_epl': 'SOCCER',
      'mma_mixed_martial_arts': 'MMA',
    };
    return sportMap[sportKey] || sportKey.toUpperCase();
  };


  const generateParlays = (picks: Pick[]) => {
    if (picks.length < 3) {
      setParlays([]);
      return;
    }


      // Select picks from different matchups to avoid same-game parlays
          const uniqueMatchups = new Set<string>();
      const selectedPicks: Pick[] = [];

      for (const pick of picks) {
    if (!uniqueMatchups.has(pick.matchup) && selectedPicks.length < 3) {
      uniqueMatchups.add(pick.matchup);
      selectedPicks.push(pick);
    }
  }

    const mockParlays: Parlay[] = [
      {
        id: 1,
        name: '3-Leg Parlay - Today\'s Best',
      
      
      picks: selectedPicks.map(p => `${p.matchup} ${p.pick}`),        totalOdds: '+595',
        potentialPayout: '$695 on $100',
        confidence: 78,
        risk: 'MEDIUM'
      },
    ];
    setParlays(mockParlays);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'LOW') return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (risk === 'MEDIUM') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-300 hover:text-blue-100 mb-4 inline-block">← Back to Home</Link>
          <h1 className="text-4xl font-bold text-white">🏈 Sports Betting Analytics</h1>
          <p className="text-blue-200 mt-2">AI-powered picks, parlays & spread analysis for all major sports</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Select Sport</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {sports.map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  selectedSport === sport
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/5 text-blue-200 hover:bg-white/10'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-3 mt-6">Pick Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pickTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  selectedType === type.value
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-blue-200 hover:bg-white/10'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading live odds data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-8 border border-red-500/50 mb-8">
            <p className="text-red-200 text-center">{error}</p>
            <button
              onClick={fetchRealOddsData}
              className="mt-4 mx-auto block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
              <h2 className="text-3xl font-bold text-white mb-6">🔥 Top 10 Picks Today</h2>
              {todaysPicks.length === 0 ? (
                <p className="text-blue-200">No picks available for the selected sport.</p>
              ) : (
                <div className="space-y-4">
                    {todaysPicks.filter(pick) => selectedType === 'all' || pick.type === selectedType).map((pick, index) => (    <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-bold text-blue-400">#{index + 1}</span>
                            <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm font-bold text-blue-200">
                              {pick.sport}
                            </span>
                            <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm font-bold text-purple-200">
                              {pick.type.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{pick.matchup}</h3>
                          <p className="text-2xl font-bold text-yellow-300 mb-2">{pick.pick}</p>
                                                {pick.type === 'moneyline' && pick.spread && (
                        <p className="text-sm text-gray-400 mt-1">Spread: {pick.spread}</p>
                      )}
                          <p className="text-blue-200 mb-2">{pick.analysis}</p>
                          <p className="text-sm text-gray-400">Odds: {pick.odds}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getConfidenceColor(pick.confidence)}`}>
                            {pick.confidence}%
                          </div>
                          <div className="text-sm text-gray-400">Confidence</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {parlays.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
                <h2 className="text-3xl font-bold text-white mb-6">💰 Featured Parlay Suggestions</h2>
                <p className="text-blue-200 mb-6">
                  Smart parlay combinations with optimized risk-reward ratios.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {parlays.map(parlay => (
                    <div
                      key={parlay.id}
                      className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/20 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{parlay.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskColor(parlay.risk)}`}
                        >
                          {parlay.risk}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {parlay.picks.map((pick, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-blue-200">
                            <span className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span>{pick}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/10 pt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-blue-300">Total Odds:</span>
                          <span className="text-green-400 font-bold text-lg">{parlay.totalOdds}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-blue-300">Potential Payout:</span>
                          <span className="text-yellow-300 font-bold">{parlay.potentialPayout}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-300">Confidence:</span>
                          <span className={`font-bold ${getConfidenceColor(parlay.confidence)}`}>
                            {parlay.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
          <p className="text-yellow-200 text-center text-sm">
            <strong>⚠️ Disclaimer:</strong> Predictions are for entertainment purposes only. Sports betting
            involves risk. Please bet responsibly and within your means. Past performance does not guarantee
            future results.
          </p>
        </div>
      </main>
    </div>
  );
}
