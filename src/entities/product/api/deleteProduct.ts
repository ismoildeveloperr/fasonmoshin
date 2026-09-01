import { API_ENDPOINTS, apiClient } from "@/shared/api";

export const deleteProduct = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.products}/${id}`);
};
