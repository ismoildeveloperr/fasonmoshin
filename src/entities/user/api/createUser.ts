import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { CreateUserPayload, User } from "../model/types";

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await apiClient.post<User>(API_ENDPOINTS.users, payload);
  console.log("MOKKY RESPONSE:", data);

  return data;
};
