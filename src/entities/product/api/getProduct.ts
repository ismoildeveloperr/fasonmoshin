import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Product } from "../model/types";

export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await apiClient.get<Product>(
    `${API_ENDPOINTS.products}/${id}`,
  );

  return data;
};
