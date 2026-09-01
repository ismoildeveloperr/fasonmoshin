import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Category, CreateCategoryPayload } from "../model/types";

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const { data } = await apiClient.post<Category>(
    API_ENDPOINTS.categories,
    payload,
  );

  return data;
};
