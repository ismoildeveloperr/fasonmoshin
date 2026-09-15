import { supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { Order, UpdateOrderPayload } from "../model/types";

export const updateOrder = async ({
  id,
  data: payload,
}: UpdateOrderPayload): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .update({
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.comment !== undefined ? { comment: payload.comment } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  throwSupabaseError(error);

  return {
    id: data.id,
    userId: data.user_id,
    products: data.products,
    customerName: data.customer_name,
    phone: data.phone,
    email: data.email,
    deliveryMethod: data.delivery_method,
    paymentMethod: data.payment_method,
    address: data.address ?? undefined,
    comment: data.comment ?? undefined,
    productsPrice: data.products_price,
    deliveryPrice: data.delivery_price,
    discount: data.discount,
    total: data.total,
    status: data.status,
    createdAt: data.created_at,
  };
};
