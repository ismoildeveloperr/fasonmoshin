import { createUser, getUserByEmail } from "@/entities/user";

import type { User } from "@/entities/user";

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export const register = async ({
  name,
  email,
  phone,
  password,
}: RegisterPayload): Promise<User> => {
  const existingUsers = await getUserByEmail(email);

  if (existingUsers.length > 0) {
    throw new Error("Пользователь с таким email уже существует");
  }

  return createUser({
    name,
    email,
    phone,

    authPassword: password,

    role: "user",
    createdAt: new Date().toISOString(),
  });
};
