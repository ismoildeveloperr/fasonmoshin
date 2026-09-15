import { getCurrentUserId, supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { Address } from "../model/types";

export const getAddresses = async (): Promise<Address[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("id");

  throwSupabaseError(error);

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    city: row.city,
    street: row.street,
    house: row.house,
    apartment: row.apartment ?? undefined,
    phone: row.phone,
    isDefault: row.is_default,
  }));
};
