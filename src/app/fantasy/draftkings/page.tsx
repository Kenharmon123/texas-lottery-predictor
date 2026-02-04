'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number;
  projected: number;
  value: number;
  ownership: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export default function DraftKingsPage() {
  const [sport, setSport] = useState('NFL');
  const [contest, setContest] = useState('CLASSIC');
  const [lineup, setLineup] = useState<{[key: string]: Player | null}>({
    QB: null,
    RB1: null,
    RB2: null,
    WR1: null,
    WR2: null,
    WR3: null,
    TE: null,
    FLEX: null,
    DST: null
  });

  const sports = ['NFL', 'NBA', 'MLB', 'NHL'];
  const contests = [
    { value: 'CLASSIC', label: 'Classic' },
    { value: 'SHOWDOWN', label: 'Showdown Captain Mode' },
    { value: 'TIERS', label: 'Tiers' }
  ];

  const topPlayers: Player[] = [
    { id: '1', name: 'Patrick Mahomes', position: 'QB', team: 'KC', opponent: 'vs SF', salary: 8500, projected: 26.8, value: 3.15, ownership: 32, trend: 'UP' },
    { id: '2', name: 'Josh Allen', position: 'QB', team: 'BUF', opponent: '@MIA', salary: 8200, projected: 25.4, value: 3.10, ownership: 28, trend: 'STABLE' },
    { id: '3', name: 'Christian McCaffrey', position: 'RB', team: 'SF', opponent: '@KC', salary: 9500, projected: 24.2, value: 2.55, ownership: 42, trend: 'UP' },
    { id: '4', name: 'Tyreek Hill', position: 'WR', team: 'MIA', opponent: 'vs BUF', salary: 8800, projected: 22.6, value: 2.57, ownership: 35, trend: 'STABLE' },
    { id: '5', name: 'Travis Kelce', position: 'TE', team: 'KC', opponent: 'vs SF', salary: 7200, projected: 18.4, value: 2.56, ownership: 38, trend: 'UP' },
    { id: '6', name: 'Derrick Henry', position: 'RB', team: 'TEN', opponent: 'vs HOU', salary: 7800, projected: 20.2, value: 2.59, ownership: 25, trend: 'UP' },
    { id: '7', name: 'CeeDee Lamb', position: 'WR', team: 'DAL', opponent: '@PHI', salary: 8400, projected: 21.8, value: 2.60, ownership: 30, trend: 'STABLE' },
    { id: '8', name: 'Justin Jefferson', position: 'WR', team: 'MIN', opponent: 'vs GB', salary: 8600, projected: 22.2, value: 2.58, ownership: 33, trend: 'DOWN' },
    { id: '9', name: 'Brock Purdy', position: 'QB', team: 'SF', opponent: '@KC', salary: 6800, projected: 21.4, value: 3.15, ownership: 18, trend: 'UP' },
    { id: '10', name: 'George Kittle', position: 'TE', team: 'SF', opponent: '@KC', salary: 6400, projected: 16.2, value: 2.53, ownership: 22, trend: 'STABLE' }
  ];

  const calculateSalaryUsed = () => {
    return Object.values(lineup).reduce((total, player) => {
      return total + (player?.salary || 0);
    }, 0);
  };

  const calculateProjected = () => {
    return Object.values(lineup).reduce((total, player) => {
      return total + (player?.projected || 0);
    }, 0).toFixed(1);
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'UP') return 'text-green-400';
    if (trend === 'DOWN') return 'text-red-400';
    return 'text-gray-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'UP') return '↑';
    if (trend === 'DOWN') return '↓';
    return '→';
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900\">
      <header className=\"bg-black/30 backdrop-blur-sm border-b border-white/10\">
        <div className=\"container mx-auto px-4 py-6\">
          <Link href=\"/\" className=\"text-blue-300 hover:text-blue-100 mb-4 inline-block\">← Back to Home</Link>
          <h1 className=\"text-4xl font-bold text-white\">👥 DraftKings Fantasy Optimizer</h1>
          <p className=\"text-blue-200 mt-2\">Build winning lineups with AI-powered player recommendations</p>
        </div>
      </header>

      <main className=\"container mx-auto px-4 py-8\">
        <div className=\"grid lg:grid-cols-3 gap-8\">
          <div className=\"lg:col-span-2 space-y-6\">
            <div className=\"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20\">
              <div className=\"flex justify-between items-center mb-6\">
                <h2 className=\"text-2xl font-bold text-white\">Contest Settings</h2>
                <div className=\"flex gap-4\">
                  {sports.map(s => (
                    <button key={s} onClick={() => setSport(s)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${sport === s ? 'bg-green-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className=\"grid md:grid-cols-3 gap-4\">
                {contests.map(c => (
                  <button key={c.value} onClick={() => setContest(c.value)} className={`p-4 rounded-xl border-2 transition-all ${contest === c.value ? 'bg-purple-500/30 border-purple-400' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                    <div className=\"text-lg font-bold text-white\">{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className=\"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20\">
              <h2 className=\"text-2xl font-bold text-white mb-6\">🏆 Top Value Plays</h2>
              <div className=\"space-y-3\">
                {topPlayers.map(player => (
                  <div key={player.id} className=\"bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all\">
                    <div className=\"flex items-center justify-between\">
                      <div className=\"flex-1\">
                        <div className=\"flex items-center gap-3 mb-2\">
                          <span className=\"px-2 py-1 bg-blue-500/30 rounded text-xs font-bold text-blue-200\">{player.position}</span>
                          <span className=\"text-white font-bold\">{player.name}</span>
                          <span className=\"text-gray-400 text-sm\">{player.team} {player.opponent}</span>
                        </div>
                        <div className=\"flex items-center gap-4 text-sm\">
                          <span className=\"text-blue-300\">Salary: <span className=\"font-bold\">${player.salary.toLocaleString()}</span></span>
                          <span className=\"text-green-400\">Proj: <span className=\"font-bold\">{player.projected}</span></span>
                          <span className=\"text-yellow-400\">Value: <span className=\"font-bold\">{player.value}</span></span>
                          <span className=\"text-purple-300\">Own: <span className=\"font-bold\">{player.ownership}%</span></span>
                          <span className={getTrendColor(player.trend)}>{getTrendIcon(player.trend)} {player.trend}</span>
                        </div>
                      </div>
                      <button className=\"px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all\">Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className=\"space-y-6\">
            <div className=\"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-4\">
              <h2 className=\"text-2xl font-bold text-white mb-4\">My Lineup</h2>
              <div className=\"mb-6\">
                <div className=\"flex justify-between mb-2\">
                  <span className=\"text-blue-200\">Salary Cap</span>
                  <span className={`font-bold ${calculateSalaryUsed() > 50000 ? 'text-red-400' : 'text-green-400'}`}>${calculateSalaryUsed().toLocaleString()} / $50,000</span>
                </div>
                <div className=\"w-full bg-white/10 rounded-full h-3\">
                  <div className={`h-3 rounded-full ${calculateSalaryUsed() > 50000 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min((calculateSalaryUsed() / 50000) * 100, 100)}%`}}></div>
                </div>
              </div>

              <div className=\"space-y-2 mb-6\">
                {Object.keys(lineup).map(position => (
                  <div key={position} className=\"bg-white/5 border border-white/10 rounded-lg p-3\">
                    <div className=\"flex justify-between items-center\">
                      <div>
                        <div className=\"text-white font-bold\">{position}</div>
                        {lineup[position] && (
                          <div className=\"text-sm text-blue-200\">{lineup[position]?.name}</div>
                        )}
                      </div>
                      <div className=\"text-right\">
                        {lineup[position] ? (
                          <>
                            <div className=\"text-green-400 text-sm\">{lineup[position]?.projected}</div>
                            <div className=\"text-gray-400 text-xs\">${lineup[position]?.salary.toLocaleString()}</div>
                          </>
                        ) : (
                          <span className=\"text-gray-500\">Empty</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className=\"border-t border-white/20 pt-4 mb-4\">
                <div className=\"flex justify-between text-lg font-bold\">
                  <span className=\"text-white\">Projected Points:</span>
                  <span className=\"text-yellow-400\">{calculateProjected()}</span>
                </div>
              </div>

              <div className=\"space-y-3\">
                <button className=\"w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all\">Optimize Lineup</button>
                <button className=\"w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all\">Export to CSV</button>
                <button className=\"w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-lg transition-all border border-red-500/50\">Clear Lineup</button>
              </div>
            </div>
          </div>
        </div>

        <div className=\"mt-8 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6\">
          <p className=\"text-yellow-200 text-center text-sm\"><strong>⚠️ Disclaimer:</strong> Projections are for entertainment purposes only. Fantasy sports involve skill and chance. Play responsibly and within your means.</p>
        </div>
      </main>
    </div>
  );
}
