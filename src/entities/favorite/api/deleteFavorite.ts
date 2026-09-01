import { API_ENDPOINTS, apiClient } from "@/shared/api";

export const deleteFavorite = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.favorites}/${id}`);
};
