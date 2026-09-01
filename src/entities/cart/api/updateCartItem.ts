import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { CartItem, UpdateCartItemPayload } from "../model/types";

export const updateCartItem = async ({
  id,
  quantity,
}: UpdateCartItemPayload): Promise<CartItem> => {
  const { data } = await apiClient.patch<CartItem>(
    `${API_ENDPOINTS.cart}/${id}`,
    {
      quantity,
    },
  );

  return data;
};
