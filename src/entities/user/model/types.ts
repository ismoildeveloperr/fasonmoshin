export type UserRole = "user" | "admin";

export type User = {
  id: string | number;

  name: string;
  email: string;
  phone: string;

  authPassword: string;

  role: UserRole;

  emailNotifications?: boolean;
  orderNotifications?: boolean;

  createdAt: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  phone: string;

  authPassword: string;

  role: UserRole;

  createdAt: string;
};

export type UpdateUserPayload = {
  id: string | number;

  data: Partial<Omit<User, "id">>;
};
