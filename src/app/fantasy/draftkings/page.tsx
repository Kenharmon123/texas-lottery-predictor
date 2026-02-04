'use client';

import Link from 'next/link';

export default function DraftKingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white text-center">👥 DraftKings Fantasy</h1>
          <p className="text-center text-blue-200 mt-2">
            Lineup Builder & Player Optimizer
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6">Fantasy Sports Optimizer</h2>
            <p className="text-blue-100 mb-4">
              Build winning daily fantasy lineups with AI-powered player projections and salary optimization.
            </p>
            
            <div className="grid md:grid-cols-4 gap-4 mt-8">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
                NFL
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all">
                NBA
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all">
                MLB
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all">
                NHL
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">🏆 Top Value Plays</h3>
              <div className="space-y-3">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">Patrick Mahomes</p>
                      <p className="text-blue-200 text-sm">QB - KC vs SF</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">26.8 pts</p>
                      <p className="text-blue-200 text-sm">$8,500</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">Christian McCaffrey</p>
                      <p className="text-blue-200 text-sm">RB - SF @KC</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">24.2 pts</p>
                      <p className="text-blue-200 text-sm">$9,500</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">Tyreek Hill</p>
                      <p className="text-blue-200 text-sm">WR - MIA vs BUF</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">22.6 pts</p>
                      <p className="text-blue-200 text-sm">$8,800</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">📊 Lineup Builder</h3>
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-blue-200">Salary Used</span>
                  <span className="text-white font-bold">$0 / $50,000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-black/20 rounded p-3">
                  <span className="text-white font-bold">QB</span>
                  <span className="text-blue-300">Empty</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 rounded p-3">
                  <span className="text-white font-bold">RB</span>
                  <span className="text-blue-300">Empty</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 rounded p-3">
                  <span className="text-white font-bold">WR</span>
                  <span className="text-blue-300">Empty</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 rounded p-3">
                  <span className="text-white font-bold">TE</span>
                  <span className="text-blue-300">Empty</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 rounded p-3">
                  <span className="text-white font-bold">FLEX</span>
                  <span className="text-blue-300">Empty</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 rounded p-3">
                  <span className="text-white font-bold">DEF</span>
                  <span className="text-blue-300">Empty</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
                Optimize Lineup
              </button>
            </div>
          </div>

          <div className="mt-8 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
            <p className="text-yellow-200 text-center text-sm">
              <strong>⚠️ Disclaimer:</strong> Projections are for entertainment purposes only. Fantasy sports involve skill and chance. Play responsibly and within your means.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
