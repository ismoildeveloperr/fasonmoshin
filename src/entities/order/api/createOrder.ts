import { supabase, throwSupabaseError } from "@/shared/api/supabase";

import type { CreateOrderPayload, Order } from "../model/types";

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const { data, error } = await supabase.rpc("create_order", {
    p_user_id: payload.userId,

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

    p_products_price: payload.productsPrice,

    p_delivery_price: payload.deliveryPrice,

    p_discount: payload.discount,

    p_total: payload.total,
  });

  throwSupabaseError(error);

  return data;
};
