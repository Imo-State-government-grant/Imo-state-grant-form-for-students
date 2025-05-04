
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client or show a helpful message if environment variables are missing
export const supabaseClient = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is properly initialized
export const isSupabaseConnected = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing. Please connect to Supabase using the Supabase button in the top right corner.');
    return false;
  }
  return true;
};

// Modified version of the client getter that ensures we don't try to use an uninitialized client
export const getSupabaseClient = () => {
  if (!isSupabaseConnected()) {
    throw new Error('Supabase is not connected. Please connect to Supabase first.');
  }
  return supabaseClient;
};
