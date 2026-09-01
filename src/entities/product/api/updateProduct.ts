import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Product, UpdateProductPayload } from "../model/types";

export const updateProduct = async ({
  id,
  data: payload,
}: UpdateProductPayload): Promise<Product> => {
  const { data } = await apiClient.patch<Product>(
    `${API_ENDPOINTS.products}/${id}`,
    payload,
  );

  return data;
};
