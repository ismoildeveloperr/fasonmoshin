import { supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { User } from "../model/types";

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  throwSupabaseError(error);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    emailNotifications: row.email_notifications,
    orderNotifications: row.order_notifications,
    createdAt: row.created_at,
  }));
};
