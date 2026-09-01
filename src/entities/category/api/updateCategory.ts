import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Category, UpdateCategoryPayload } from "../model/types";

export const updateCategory = async ({
  id,
  data: payload,
}: UpdateCategoryPayload): Promise<Category> => {
  const { data } = await apiClient.patch<Category>(
    `${API_ENDPOINTS.categories}/${id}`,
    payload,
  );

  return data;
};
