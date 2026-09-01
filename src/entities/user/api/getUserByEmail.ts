import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { User } from "../model/types";

export const getUserByEmail = async (email: string): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(API_ENDPOINTS.users, {
    params: {
      email,
    },
  });

  return data;
};
