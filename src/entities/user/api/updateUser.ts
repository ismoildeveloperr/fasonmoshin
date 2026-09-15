import { supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { UpdateUserPayload, User } from "../model/types";

export const updateUser = async ({
  id,
  data: payload,
}: UpdateUserPayload): Promise<User> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.email !== undefined ? { email: payload.email } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.role !== undefined ? { role: payload.role } : {}),
      ...(payload.emailNotifications !== undefined
        ? { email_notifications: payload.emailNotifications }
        : {}),
      ...(payload.orderNotifications !== undefined
        ? { order_notifications: payload.orderNotifications }
        : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  throwSupabaseError(error);

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    emailNotifications: data.email_notifications,
    orderNotifications: data.order_notifications,
    createdAt: data.created_at,
  };
};
