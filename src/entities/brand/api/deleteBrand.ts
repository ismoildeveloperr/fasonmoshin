import { API_ENDPOINTS, apiClient } from "@/shared/api";

export const deleteBrand = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.brands}/${id}`);
};
