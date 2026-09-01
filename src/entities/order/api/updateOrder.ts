import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Order, UpdateOrderPayload } from "../model/types";

export const updateOrder = async ({
  id,
  data: payload,
}: UpdateOrderPayload): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(
    `${API_ENDPOINTS.orders}/${id}`,
    payload,
  );

  return data;
};
