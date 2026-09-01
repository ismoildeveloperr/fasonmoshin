import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { CartItem } from "../model/types";

export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await apiClient.get<CartItem[]>(API_ENDPOINTS.cart);

  return data;
};
