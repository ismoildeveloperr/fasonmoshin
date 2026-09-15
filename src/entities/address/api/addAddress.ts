import { getCurrentUserId, supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { AddAddressPayload, Address } from "../model/types";

export const addAddress = async (
  payload: AddAddressPayload,
): Promise<Address> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      title: payload.title,
      city: payload.city,
      street: payload.street,
      house: payload.house,
      apartment: payload.apartment ?? null,
      phone: payload.phone,
      is_default: payload.isDefault,
    })
    .select("*")
    .single();

  throwSupabaseError(error);

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    city: data.city,
    street: data.street,
    house: data.house,
    apartment: data.apartment ?? undefined,
    phone: data.phone,
    isDefault: data.is_default,
  };
};
