import { supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { CartItem, UpdateCartItemPayload } from "../model/types";

export const updateCartItem = async ({
  id,
  quantity,
}: UpdateCartItemPayload): Promise<CartItem> => {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", id)
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
