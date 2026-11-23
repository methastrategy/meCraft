import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;
const envUrl = metaEnv?.VITE_SUPABASE_URL || '';
const envKey = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

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
