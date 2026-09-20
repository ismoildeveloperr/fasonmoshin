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

  const order = Array.isArray(data) ? data[0] : data;

  return {
    id: order.id,
    userId: order.user_id,

    products: order.products,

    customerName: order.customer_name,

    phone: order.phone,

    email: order.email,

    deliveryMethod: order.delivery_method,

    paymentMethod: order.payment_method,

    address: order.address ?? undefined,

    comment: order.comment ?? undefined,

    productsPrice: order.products_price,

    deliveryPrice: order.delivery_price,

    discount: order.discount,

    total: order.total,

    status: order.status,

    createdAt: order.created_at,
  };
};
