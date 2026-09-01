import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Address } from "../model/types";

export const getAddresses = async (): Promise<Address[]> => {
  const { data } = await apiClient.get<Address[]>(API_ENDPOINTS.addresses);

  return data;
};
