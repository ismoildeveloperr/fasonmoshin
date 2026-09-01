import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { Favorite } from "../model/types";

type AddFavoritePayload = {
  userId: string | number;
  productId: string | number;
};

export const addFavorite = async (
  payload: AddFavoritePayload,
): Promise<Favorite> => {
  const { data } = await apiClient.post<Favorite>(
    API_ENDPOINTS.favorites,
    payload,
  );

  return data;
};
