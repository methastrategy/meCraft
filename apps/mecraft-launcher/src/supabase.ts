import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read Vite environment variables using direct property access with production fallback
const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://xljpiwxamqzsqlvdwbvy.supabase.co';
const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsanBpd3hhbXF6c3FsdmR3YnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NDEzMDcsImV4cCI6MjExMTAxNzMwN30.KU32Ma4AB3GvL_apkcgsRbkeyzfOV1KUwhanY_yjZFA';

export const isLiveSupabaseConfigured = (): boolean => {
  return Boolean(envUrl && envKey && envUrl.startsWith('http') && envKey.length > 20);
};

export const supabase: SupabaseClient | null = isLiveSupabaseConfigured()
  ? createClient(envUrl, envKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window ? 'pkce' : 'implicit',
      },
    })
  : null;
