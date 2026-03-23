import { createClient } from "@supabase/supabase-js";

let _client;

/** Returns Supabase client or null if env is not configured (avoids build/runtime errors on empty URL). */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  if (!_client) _client = createClient(url, key);
  return _client;
}
