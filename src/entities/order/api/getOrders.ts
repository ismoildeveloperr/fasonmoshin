import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Order } from "../model/types";

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>(API_ENDPOINTS.orders);

  return data;
};
