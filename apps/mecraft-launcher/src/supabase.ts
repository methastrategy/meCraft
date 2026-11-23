import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read Vite environment variables using direct property access for Vite build inlining
const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

export const isLiveSupabaseConfigured = (): boolean => {
  return Boolean(envUrl && envKey && envUrl.startsWith('http') && envKey.length > 20);
};

export const supabase: SupabaseClient | null = isLiveSupabaseConfigured()
  ? createClient(envUrl, envKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
