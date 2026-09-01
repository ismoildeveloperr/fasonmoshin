import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { User } from "@/entities/user";

type LoginPayload = {
  email: string;
  password: string;
};

export const login = async ({
  email,
  password,
}: LoginPayload): Promise<User> => {
  const normalizedEmail = email.trim().toLowerCase();

  const normalizedPassword = password.trim();

  const { data } = await apiClient.get<User[]>(API_ENDPOINTS.users);

  const user = data.find(
    (item) =>
      item.email.trim().toLowerCase() === normalizedEmail &&
      item.authPassword === normalizedPassword,
  );

  if (!user) {
    throw new Error("Неверный email или пароль");
  }

  return user;
};
