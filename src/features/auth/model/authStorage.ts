import type { User } from "@/entities/user";

const AUTH_STORAGE_KEY = "fasonmoshin_user";

export const saveAuthUser = (user: User) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getAuthUser = (): User | null => {
  const value = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
};

export const removeAuthUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAuthenticated = () => {
  return Boolean(getAuthUser());
};
