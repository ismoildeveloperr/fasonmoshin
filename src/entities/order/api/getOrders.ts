import {
  getCurrentUserId,
  supabase,
  throwSupabaseError,
} from "@/shared/api/supabase";

import type { Order } from "../model/types";

export const getOrders = async (): Promise<Order[]> => {
  const userId = await getCurrentUserId();
  const { data: isAdmin, error: roleError } = await supabase.rpc("is_admin");

  throwSupabaseError(roleError);

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  throwSupabaseError(error);

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    products: row.products,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    deliveryMethod: row.delivery_method,
    paymentMethod: row.payment_method,
    address: row.address ?? undefined,
    comment: row.comment ?? undefined,
    productsPrice: row.products_price,
    deliveryPrice: row.delivery_price,
    discount: row.discount,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
  }));
};
