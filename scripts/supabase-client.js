import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.2";

const SUPABASE_URL = "https://cjjeohqshlttsvjcwgmx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_lZW7HKRL1UntLigcaRqTyA_ulG6sq4X";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
