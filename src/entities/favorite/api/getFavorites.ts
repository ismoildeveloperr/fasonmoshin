import { getCurrentUserId, supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { Favorite } from "../model/types";

export const getFavorites = async (): Promise<Favorite[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("id");

  throwSupabaseError(error);

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
  }));
};
