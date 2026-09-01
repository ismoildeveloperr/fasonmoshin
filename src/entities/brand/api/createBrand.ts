import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Brand, CreateBrandPayload } from "../model/types";

export const createBrand = async (
  payload: CreateBrandPayload,
): Promise<Brand> => {
  const { data } = await apiClient.post<Brand>(API_ENDPOINTS.brands, payload);

  return data;
};
