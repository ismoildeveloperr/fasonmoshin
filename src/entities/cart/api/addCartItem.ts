import { getCurrentUserId, supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { AddCartItemPayload, CartItem } from "../model/types";

export const addCartItem = async (
  payload: AddCartItemPayload,
): Promise<CartItem> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("cart_items")
    .upsert(
      {
        user_id: userId,
        product_id: payload.productId,
        quantity: payload.quantity,
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
    quantity: data.quantity,
  };
};
