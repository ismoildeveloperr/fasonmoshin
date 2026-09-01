import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Product } from "../model/types";

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>(API_ENDPOINTS.products);

  return data;
};
