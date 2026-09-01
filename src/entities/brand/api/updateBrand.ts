import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Brand, UpdateBrandPayload } from "../model/types";

export const updateBrand = async ({
  id,
  data: payload,
}: UpdateBrandPayload): Promise<Brand> => {
  const { data } = await apiClient.patch<Brand>(
    `${API_ENDPOINTS.brands}/${id}`,
    payload,
  );

  return data;
};
