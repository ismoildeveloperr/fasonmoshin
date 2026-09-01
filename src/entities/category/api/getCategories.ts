import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Category } from "../model/types";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>(API_ENDPOINTS.categories);

  return data;
};
