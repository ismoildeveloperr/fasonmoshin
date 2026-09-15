import { supabase } from "./supabaseClient";

export const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Пользователь не авторизован");
  }

  return user.id;
};

export const throwSupabaseError = (error: { message: string } | null): void => {
  if (error) {
    throw new Error(error.message);
  }
};
