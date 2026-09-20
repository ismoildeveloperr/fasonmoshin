import { supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { CreateOrderPayload, Order } from "../model/types";

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const { data, error } = await supabase.rpc("create_order", {
    p_products: payload.products.map((product) => ({
      product_id: product.productId,
      quantity: product.quantity,
    })),

    p_customer_name: payload.customerName,

    p_phone: payload.phone,

    p_email: payload.email,

    p_delivery_method: payload.deliveryMethod,

    p_payment_method: payload.paymentMethod,

    p_address: payload.address ?? null,

    p_comment: payload.comment ?? null,
  });

  throwSupabaseError(error);

  if (!data) {
    throw new Error("Supabase не вернул созданный заказ");
  }

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
