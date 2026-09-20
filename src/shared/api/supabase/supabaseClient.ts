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

/**
 * Получение текущего пользователя Supabase Auth
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("Пользователь не авторизован");
  }

  return user;
};

/**
 * Получение UUID текущего пользователя
 */
export const getCurrentUserId = async (): Promise<string> => {
  const user = await getCurrentUser();

  return user.id;
};

/**
 * Проверка ошибок Supabase
 */
export const throwSupabaseError = (error: unknown) => {
  if (error) {
    console.error("SUPABASE ERROR:", error);

    throw error;
  }
};
