import { getCurrentUserId, supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { CartItem } from "../model/types";

export const getCart = async (): Promise<CartItem[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .order("id");

  throwSupabaseError(error);

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    quantity: row.quantity,
  }));
};
