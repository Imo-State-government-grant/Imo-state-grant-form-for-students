
import { createClient } from '@supabase/supabase-js';

// The createClient function is initialized with the URL and anon key once the Supabase integration is connected
export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Helper function to check if Supabase is properly initialized
export const isSupabaseConnected = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};
