import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { AddAddressPayload, Address } from "../model/types";

export const addAddress = async (
  payload: AddAddressPayload,
): Promise<Address> => {
  const { data } = await apiClient.post<Address>(
    API_ENDPOINTS.addresses,
    payload,
  );

  return data;
};
