import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase не настроен: задайте VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY",
  );
}

try {
  new URL(supabaseUrl);
} catch {
  throw new Error("VITE_SUPABASE_URL имеет неверный формат");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
