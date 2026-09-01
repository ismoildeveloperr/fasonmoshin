import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Address, UpdateAddressPayload } from "../model/types";

export const updateAddress = async ({
  id,
  data,
}: UpdateAddressPayload): Promise<Address> => {
  const response = await apiClient.patch<Address>(
    `${API_ENDPOINTS.addresses}/${id}`,
    data,
  );

  return response.data;
};
