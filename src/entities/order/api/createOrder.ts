import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { CreateOrderPayload, Order } from "../model/types";

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const { data } = await apiClient.post<Order>(API_ENDPOINTS.orders, payload);

  return data;
};
