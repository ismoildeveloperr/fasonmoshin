import { supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { Address, UpdateAddressPayload } from "../model/types";

export const updateAddress = async ({
  id,
  data,
}: UpdateAddressPayload): Promise<Address> => {
  const { data: row, error } = await supabase
    .from("addresses")
    .update({
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.street !== undefined ? { street: data.street } : {}),
      ...(data.house !== undefined ? { house: data.house } : {}),
      ...(data.apartment !== undefined ? { apartment: data.apartment } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.isDefault !== undefined ? { is_default: data.isDefault } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  throwSupabaseError(error);

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    city: row.city,
    street: row.street,
    house: row.house,
    apartment: row.apartment ?? undefined,
    phone: row.phone,
    isDefault: row.is_default,
  };
};
