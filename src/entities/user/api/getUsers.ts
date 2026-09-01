import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { User } from "../model/types";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(API_ENDPOINTS.users);

  return data;
};
