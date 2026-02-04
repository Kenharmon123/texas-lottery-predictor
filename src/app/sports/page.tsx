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

  const sports = ['ALL', 'NFL', 'NBA', 'MLB', 'NHL', 'SOCCER', 'MMA'];
  const pickTypes = [
    { value: 'all', label: 'All Picks' },
    { value: 'spread', label: 'Against Spread' },
    { value: 'moneyline', label: 'Moneyline' },
    { value: 'over-under', label: 'Over/Under' },
  ];

  useEffect(() => {
    generateTodaysPicks();
    generateParlays();
  }, [selectedSport, selectedType]);

  const generateTodaysPicks = () => {
    const mockPicks: Pick[] = [
      { id: 1, sport: 'NFL', matchup: 'Chiefs vs 49ers', pick: 'Chiefs -3.5', type: 'spread', odds: '-110', confidence: 87, analysis: 'Chiefs strong home performance, 49ers key injury concerns' },
      { id: 2, sport: 'NFL', matchup: 'Cowboys vs Eagles', pick: 'OVER 48.5', type: 'over-under', odds: '-115', confidence: 82, analysis: 'Both teams averaging 27+ PPG, weak defenses' },
      { id: 3, sport: 'NBA', matchup: 'Lakers vs Celtics', pick: 'Celtics ML', type: 'moneyline', odds: '-145', confidence: 90, analysis: 'Celtics 8-2 at home, Lakers missing key players' },
      { id: 4, sport: 'NBA', matchup: 'Warriors vs Suns', pick: 'Warriors +5.5', type: 'spread', odds: '-110', confidence: 79, analysis: 'Warriors covering 70% on road this season' },
      { id: 5, sport: 'MLB', matchup: 'Yankees vs Red Sox', pick: 'UNDER 9.5', type: 'over-under', odds: '-105', confidence: 85, analysis: 'Strong pitching matchup, cool weather conditions' },
      { id: 6, sport: 'MLB', matchup: 'Dodgers vs Padres', pick: 'Dodgers ML', type: 'moneyline', odds: '-130', confidence: 83, analysis: 'Dodgers ace on mound, Padres slumping 2-8 L10' },
      { id: 7, sport: 'NHL', matchup: 'Maple Leafs vs Bruins', pick: 'Bruins -1.5', type: 'spread', odds: '+145', confidence: 76, analysis: 'Bruins dominant home record, Leafs backup goalie' },
      { id: 8, sport: 'NHL', matchup: 'Avalanche vs Lightning', pick: 'OVER 6.5', type: 'over-under', odds: '-110', confidence: 81, analysis: 'High-scoring teams, both shaky goaltending recently' },
      { id: 9, sport: 'SOCCER', matchup: 'Man City vs Liverpool', pick: 'BTTS (Both Teams to Score)', type: 'moneyline', odds: '-125', confidence: 88, analysis: 'Elite attacking teams, both scored in last 6 meetings' },
      { id: 10, sport: 'MMA', matchup: 'Jones vs Miocic', pick: 'Jones by Decision', type: 'moneyline', odds: '+180', confidence: 74, analysis: 'Jones superior striking, likely goes distance' },
    ];

    let filtered = mockPicks;
    if (selectedSport !== 'ALL') filtered = filtered.filter(pick => pick.sport === selectedSport);
    if (selectedType !== 'all') filtered = filtered.filter(pick => pick.type === selectedType);
    setTodaysPicks(filtered);
  };

  const generateParlays = () => {
    const mockParlays: Parlay[] = [
      { id: 1, name: '3-Leg Parlay - NFL Sunday Special', picks: ['Chiefs -3.5 vs 49ers', 'Cowboys vs Eagles OVER 48.5', 'Bills ML vs Dolphins'], totalOdds: '+595', potentialPayout: '$695 on $100', confidence: 78, risk: 'MEDIUM' },
      { id: 2, name: '4-Leg Parlay - NBA Tonight', picks: ['Celtics ML vs Lakers', 'Warriors +5.5 vs Suns', 'Bucks -7 vs Pistons', 'Nuggets OVER 225 vs Clippers'], totalOdds: '+1250', potentialPayout: '$1,350 on $100', confidence: 65, risk: 'HIGH' },
      { id: 3, name: '3-Leg Parlay - MLB Aces', picks: ['Yankees UNDER 9.5 vs Red Sox', 'Dodgers ML vs Padres', 'Braves -1.5 vs Nationals'], totalOdds: '+485', potentialPayout: '$585 on $100', confidence: 81, risk: 'LOW' },
      { id: 4, name: '5-Leg Parlay - Multi-Sport Value', picks: ['Chiefs -3.5 (NFL)', 'Celtics ML (NBA)', 'Dodgers ML (MLB)', 'Bruins -1.5 (NHL)', 'Man City BTTS (SOCCER)'], totalOdds: '+2800', potentialPayout: '$2,900 on $100', confidence: 58, risk: 'HIGH' },
      { id: 5, name: '2-Leg Parlay - Safe Favorites', picks: ['Chiefs ML vs 49ers', 'Celtics ML vs Lakers'], totalOdds: '+165', potentialPayout: '$265 on $100', confidence: 89, risk: 'LOW' },
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
              <button key={sport} onClick={() => setSelectedSport(sport)} className={`py-3 px-4 rounded-lg font-semibold transition-all ${selectedSport === sport ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-white/5 text-blue-200 hover:bg-white/10'}`}>{sport}</button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-3 mt-6">Pick Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pickTypes.map(type => (
              <button key={type.value} onClick={() => setSelectedType(type.value)} className={`py-3 px-4 rounded-lg font-semibold transition-all ${selectedType === type.value ? 'bg-purple-500 text-white shadow-lg' : 'bg-white/5 text-blue-200 hover:bg-white/10'}`}>{type.label}</button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">🔥 Top 10 Picks Today</h2>
          <div className="space-y-4">
            {todaysPicks.map((pick, index) => (
              <div key={pick.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-blue-400">#{index + 1}</span>
                      <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm font-bold text-blue-200">{pick.sport}</span>
                      <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm font-bold text-purple-200">{pick.type.toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{pick.matchup}</h3>
                    <p className="text-2xl font-bold text-yellow-300 mb-2">{pick.pick}</p>
                    <p className="text-blue-200 mb-2">{pick.analysis}</p>
                    <p className="text-sm text-gray-400">Odds: {pick.odds}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getConfidenceColor(pick.confidence)}`}>{pick.confidence}%</div>
                    <div className="text-sm text-gray-400">Confidence</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">💰 Featured Parlay Suggestions</h2>
          <p className="text-blue-200 mb-6">Smart parlay combinations with optimized risk-reward ratios. Multiple picks can be played at the same time - picking the best winners against the spread across all team sports.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {parlays.map(parlay => (
              <div key={parlay.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/20 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{parlay.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskColor(parlay.risk)}`}>{parlay.risk}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {parlay.picks.map((pick, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-blue-200">
                      <span className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
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
                    <span className={`font-bold ${getConfidenceColor(parlay.confidence)}`}>{parlay.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
          <p className="text-yellow-200 text-center text-sm"><strong>⚠️ Disclaimer:</strong> Predictions are for entertainment purposes only. Sports betting involves risk. Please bet responsibly and within your means. Past performance does not guarantee future results.</p>
        </div>
      </main>
    </div>
  );
}
