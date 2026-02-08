import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types for our database tables
export type GameType = 'lotto_texas' | 'powerball' | 'mega_millions' | 'cash_five' | 'daily_4' | 'pick_3';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface LotteryDraw {
  id: string;
  game_type: GameType;
  draw_date: string;
  winning_numbers: number[];
  bonus_numbers: number[] | null;
  jackpot_amount: number | null;
  created_at: string;
}

export interface PredictionHistory {
  id: string;
  user_id: string | null;
  game_type: GameType;
  predicted_numbers: number[];
  confidence_score: number | null;
  prediction_meta: Record<string, any>;
  created_at: string;
}
