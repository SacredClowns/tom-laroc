// Server-side Supabase client. Returns null when env isn't configured, so the
// data layer transparently falls back to the local file store during local dev
// and before the free Supabase project is wired.
//
// Set in .env.local (from Tom's own free project — NOT shared):
//   SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...   (server-only, never expose to the client)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  cached = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cached;
}

export const usingSupabase = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
