import { supabase, throwSupabaseError } from "@/shared/api/supabase";

export const deleteAddress = async (id: string | number): Promise<void> => {
  const { error } = await supabase.from("addresses").delete().eq("id", id);

  throwSupabaseError(error);
};
