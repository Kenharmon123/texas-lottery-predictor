import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Texas Lottery & Sports Predictor | AI-Powered Predictions',
  description: 'AI-powered predictions for Texas Lottery, Mega Millions, Powerball, sports analytics, and DraftKings fantasy. Get smart number recommendations based on historical data analysis.',
  keywords: 'Texas lottery, lottery predictions, sports betting, fantasy sports, DraftKings, Mega Millions, Powerball, AI predictions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
