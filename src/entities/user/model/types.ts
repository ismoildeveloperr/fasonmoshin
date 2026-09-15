export type UserRole = "user" | "admin";

export type User = {
  id: string | number;

  name: string;
  email: string;
  phone: string;

  role: UserRole;

  emailNotifications?: boolean;
  orderNotifications?: boolean;

  createdAt: string;
};

export type UpdateUserPayload = {
  id: string | number;

  data: Partial<Omit<User, "id">>;
};
