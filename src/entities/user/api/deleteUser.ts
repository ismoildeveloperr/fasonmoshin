import { API_ENDPOINTS, apiClient } from "@/shared/api";

export const deleteUser = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.users}/${id}`);
};
