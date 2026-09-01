import { API_ENDPOINTS, apiClient } from "@/shared/api";

export const deleteAddress = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.addresses}/${id}`);
};
