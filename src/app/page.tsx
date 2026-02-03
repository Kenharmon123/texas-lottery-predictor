'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white text-center">
            🎰 Texas Lottery & Sports Predictor
          </h1>
          <p className="text-center text-blue-200 mt-2">
            AI-Powered Predictions for Smart Players
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Texas Lottery Section */}
          <Link href="/lottery/texas" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-6xl mb-4">🎟️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Texas Lottery</h2>
              <p className="text-blue-100 mb-6">
                Get predictions for all Texas Lottery games including Daily 4, Cash Five, Lotto Texas, and more.
              </p>
              <ul className="text-sm text-blue-200 space-y-2 mb-6">
                <li>✓ Historical data analysis</li>
                <li>✓ Hot & cold numbers</li>
                <li>✓ Frequency patterns</li>
                <li>✓ Smart number selection</li>
              </ul>
              <div className="text-yellow-300 font-semibold group-hover:translate-x-2 transition-transform">
                Start Predicting →
              </div>
            </div>
          </Link>

          {/* Mega Millions & Powerball Section */}
          <Link href="/lottery/mega-powerball" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-6xl mb-4">💰</div>
              <h2 className="text-3xl font-bold text-white mb-4">Mega Millions & Powerball</h2>
              <p className="text-blue-100 mb-6">
                Advanced predictions for national lottery jackpots with millions in prizes.
              </p>
              <ul className="text-sm text-blue-200 space-y-2 mb-6">
                <li>✓ Weighted number selection</li>
                <li>✓ Jackpot odds analysis</li>
                <li>✓ Pair frequency tracking</li>
                <li>✓ Statistical insights</li>
              </ul>
              <div className="text-yellow-300 font-semibold group-hover:translate-x-2 transition-transform">
                Get Lucky Numbers →
              </div>
            </div>
          </Link>

          {/* Sports Analytics Section */}
          <Link href="/sports" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-6xl mb-4">🏈</div>
              <h2 className="text-3xl font-bold text-white mb-4">Sports Analytics</h2>
              <p className="text-blue-100 mb-6">
                Comprehensive predictions for NFL, NBA, MLB, NHL, Soccer, and more.
              </p>
              <ul className="text-sm text-blue-200 space-y-2 mb-6">
                <li>✓ Real-time odds & lines</li>
                <li>✓ Team performance analysis</li>
                <li>✓ Injury impact assessment</li>
                <li>✓ Weather & venue factors</li>
              </ul>
              <div className="text-yellow-300 font-semibold group-hover:translate-x-2 transition-transform">
                Analyze Games →
              </div>
            </div>
          </Link>

          {/* DraftKings Fantasy Section */}
          <Link href="/fantasy/draftkings" className="group">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-3xl font-bold text-white mb-4">DraftKings Fantasy</h2>
              <p className="text-blue-100 mb-6">
                Optimize your fantasy lineups with individual player stats and projections.
              </p>
              <ul className="text-sm text-blue-200 space-y-2 mb-6">
                <li>✓ Player performance tracking</li>
                <li>✓ Value-based recommendations</li>
                <li>✓ Matchup analysis</li>
                <li>✓ Salary cap optimization</li>
              </ul>
              <div className="text-yellow-300 font-semibold group-hover:translate-x-2 transition-transform">
                Build Lineup →
              </div>
            </div>
          </Link>
          
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-16 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
          <p className="text-yellow-200 text-center text-sm">
            <strong>⚠️ Disclaimer:</strong> This tool provides predictions based on historical data and statistical analysis. 
            Lottery and sports betting involve chance and risk. Please play responsibly and within your means. 
            Past performance does not guarantee future results.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-blue-200">
          <p>© 2026 Texas Lottery & Sports Predictor • AI-Powered Predictions</p>
          <p className="text-sm mt-2 text-blue-300">For entertainment purposes only • Play responsibly</p>
        </div>
      </footer>
    </div>
  );
}
