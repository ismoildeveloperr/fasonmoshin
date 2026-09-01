import { API_ENDPOINTS, apiClient } from "@/shared/api";

export const deleteCategory = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.categories}/${id}`);
};
