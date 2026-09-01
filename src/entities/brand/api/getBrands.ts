import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Brand } from "../model/types";

export const getBrands = async (): Promise<Brand[]> => {
  const { data } = await apiClient.get<Brand[]>(API_ENDPOINTS.brands);

  return data;
};
