import { getCurrentUserId, supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { Favorite } from "../model/types";

type AddFavoritePayload = {
  userId: string | number;
  productId: string | number;
};

export const addFavorite = async (
  payload: AddFavoritePayload,
): Promise<Favorite> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("favorites")
    .upsert(
      {
        user_id: userId,
        product_id: payload.productId,
      },
      { onConflict: "user_id,product_id" },
    )
    .select("*")
    .single();

  throwSupabaseError(error);

  return {
    id: data.id,
    userId: data.user_id,
    productId: data.product_id,
  };
};
