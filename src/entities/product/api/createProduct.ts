import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { CreateProductPayload, Product } from "../model/types";

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const { data } = await apiClient.post<Product>(
    API_ENDPOINTS.products,
    payload,
  );

  return data;
};
