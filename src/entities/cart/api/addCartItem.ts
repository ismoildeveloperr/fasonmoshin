import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { AddCartItemPayload, CartItem } from "../model/types";

export const addCartItem = async (
  payload: AddCartItemPayload,
): Promise<CartItem> => {
  const { data } = await apiClient.post<CartItem>(API_ENDPOINTS.cart, payload);

  return data;
};
