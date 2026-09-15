import { supabase, throwSupabaseError } from "@/shared/api/supabase";

export const deleteFavorite = async (id: string | number): Promise<void> => {
  const { error } = await supabase.from("favorites").delete().eq("id", id);

  throwSupabaseError(error);
};
