import { supabase, throwSupabaseError } from "@/shared/api/supabase";

export const deleteUser = async (id: string | number): Promise<void> => {
  const { error } = await supabase.rpc("disable_user", {
    target_user_id: String(id),
  });

  throwSupabaseError(error);
};
