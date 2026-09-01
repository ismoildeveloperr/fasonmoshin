import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { UpdateUserPayload, User } from "../model/types";

export const updateUser = async ({
  id,
  data: payload,
}: UpdateUserPayload): Promise<User> => {
  const { data } = await apiClient.patch<User>(
    `${API_ENDPOINTS.users}/${id}`,
    payload,
  );

  return data;
};
