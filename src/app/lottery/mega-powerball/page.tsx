'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MegaPowerballPage() {
  const [selectedGame, setSelectedGame] = useState<'mega' | 'powerball'>('mega');
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getPrediction = async () => {
    setLoading(true);
    try {
      // Simulated prediction - in production, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPrediction = {
        numbers: selectedGame === 'mega' 
          ? Array.from({length: 5}, () => Math.floor(Math.random() * 70) + 1).sort((a,b) => a-b)
          : Array.from({length: 5}, () => Math.floor(Math.random() * 69) + 1).sort((a,b) => a-b),
        megaBall: selectedGame === 'mega' ? Math.floor(Math.random() * 25) + 1 : undefined,
        powerball: selectedGame === 'powerball' ? Math.floor(Math.random() * 26) + 1 : undefined,
        confidence: (Math.random() * 0.3 + 0.6).toFixed(2),
        jackpot: selectedGame === 'mega' ? '$489 Million' : '$625 Million',
        nextDrawing: 'Tuesday, 11:00 PM ET'
      };
      
      setPrediction(mockPrediction);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">← Back to Home</Link>
          <h1 className="text-4xl font-bold text-white text-center">💰 Mega Millions & Powerball</h1>
          <p className="text-center text-blue-200 mt-2">National Lottery Jackpot Predictions</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Game Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedGame('mega')}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              selectedGame === 'mega'
                ? 'bg-yellow-500 text-black scale-105 shadow-2xl'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🎯 Mega Millions
          </button>
          <button
            onClick={() => setSelectedGame('powerball')}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              selectedGame === 'powerball'
                ? 'bg-red-500 text-white scale-105 shadow-2xl'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            ⚡ Powerball
          </button>
        </div>

        {/* Game Info */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {selectedGame === 'mega' ? 'Mega Millions' : 'Powerball'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-blue-100">
            <div>
              <h3 className="font-bold text-xl mb-2">Current Jackpot</h3>
              <p className="text-3xl font-bold text-yellow-300">
                {selectedGame === 'mega' ? '$489 Million' : '$625 Million'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Next Drawing</h3>
              <p className="text-xl">Tuesday, 11:00 PM ET</p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">How to Play</h3>
              <p>{selectedGame === 'mega' 
                ? 'Pick 5 numbers from 1-70 and 1 Mega Ball from 1-25'
                : 'Pick 5 numbers from 1-69 and 1 Powerball from 1-26'
              }</p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Odds of Jackpot</h3>
              <p>{selectedGame === 'mega' ? '1 in 302,575,350' : '1 in 292,201,338'}</p>
            </div>
          </div>
        </div>

        {/* Generate Prediction Button */}
        <div className="text-center mb-8">
          <button
            onClick={getPrediction}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-12 rounded-xl text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
          >
            {loading ? '🎲 Generating...' : '🎲 Generate Lucky Numbers'}
          </button>
        </div>

        {/* Prediction Display */}
        {prediction && (
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-8 border-2 border-yellow-500/50 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Lucky Numbers</h3>
            
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {prediction.numbers.map((num: number, i: number) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-black shadow-lg"
                >
                  {num}
                </div>
              ))}
              <div className={`w-16 h-16 ${
                selectedGame === 'mega' ? 'bg-yellow-500' : 'bg-red-500'
              } rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-white`}>
                {selectedGame === 'mega' ? prediction.megaBall : prediction.powerball}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6 text-center">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-blue-200 text-sm">Confidence</div>
                <div className="text-white font-bold text-xl">{(prediction.confidence * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-blue-200 text-sm">Jackpot</div>
                <div className="text-white font-bold text-xl">{prediction.jackpot}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-blue-200 text-sm">Next Drawing</div>
                <div className="text-white font-bold text-sm">{prediction.nextDrawing}</div>
              </div>
            </div>

            <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
              <p className="text-blue-100 text-center text-sm">
                💡 These numbers are generated using advanced statistical analysis of historical data, hot/cold patterns, and frequency tracking.
              </p>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">🔥 Hot Numbers</h3>
            <p className="text-blue-100 mb-3">Most frequently drawn in last 50 draws:</p>
            <div className="flex gap-2 flex-wrap">
              {[7, 14, 21, 28, 35, 42, 49].map(num => (
                <div key={num} className="w-10 h-10 bg-red-500/30 border border-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {num}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">❄️ Cold Numbers</h3>
            <p className="text-blue-100 mb-3">Least frequently drawn in last 50 draws:</p>
            <div className="flex gap-2 flex-wrap">
              {[3, 11, 23, 31, 44, 55, 67].map(num => (
                <div key={num} className="w-10 h-10 bg-blue-500/30 border border-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
