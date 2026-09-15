import { supabase, throwSupabaseError } from "@/shared/api/supabase";

export const deleteCartItem = async (id: string | number): Promise<void> => {
  const { error } = await supabase.from("cart_items").delete().eq("id", id);

  throwSupabaseError(error);
};
