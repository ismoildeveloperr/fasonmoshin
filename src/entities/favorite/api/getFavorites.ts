import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Favorite } from "../model/types";

export const getFavorites = async (): Promise<Favorite[]> => {
  const { data } = await apiClient.get<Favorite[]>(API_ENDPOINTS.favorites);

  return data;
};
