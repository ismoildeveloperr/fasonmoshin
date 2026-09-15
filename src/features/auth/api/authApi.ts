import type { User } from "@supabase/supabase-js";

import { supabase } from "@/shared/api/supabase";

export type AuthRole = "user" | "admin";

export type AuthUser = {
  id: string;

  name: string;

  email: string;

  phone: string;

  role: AuthRole;

  createdAt: string;

  emailNotifications: boolean;

  orderNotifications: boolean;
};

type LoginParams = {
  email: string;
  password: string;
};

type RegisterParams = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type UpdateAuthUserData = Partial<{
  email: string;
  name: string;
  phone: string;
  emailNotifications: boolean;
  orderNotifications: boolean;
}>;

export type RegisterResult = {
  user: AuthUser | null;
  requiresEmailConfirmation: boolean;
};

export const mapSupabaseUser = (
  user: User,
  role: AuthRole = user.app_metadata?.role === "admin" ? "admin" : "user",
): AuthUser => {
  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,

    name: typeof metadata.name === "string" ? metadata.name : "Пользователь",

    email: user.email ?? "",

    phone: typeof metadata.phone === "string" ? metadata.phone : "",

    role,

    createdAt: user.created_at,

    emailNotifications:
      typeof metadata.emailNotifications === "boolean"
        ? metadata.emailNotifications
        : true,

    orderNotifications:
      typeof metadata.orderNotifications === "boolean"
        ? metadata.orderNotifications
        : true,
  };
};

export const getAuthUser = async (user: User): Promise<AuthUser> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role, is_disabled")
    .eq("id", user.id)
    .maybeSingle<{ role: AuthRole; is_disabled: boolean }>();

  if (error) {
    throw new Error(`Не удалось загрузить профиль пользователя: ${error.message}`);
  }

  if (data?.is_disabled) {
    await supabase.auth.signOut();
    throw new Error("Учётная запись отключена");
  }

  return mapSupabaseUser(user, data?.role ?? "user");
};

export const register = async ({
  name,
  email,
  phone,
  password,
}: RegisterParams): Promise<RegisterResult> => {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,

    options: {
      data: {
        name: name.trim(),

        phone: phone.trim(),

        emailNotifications: true,

        orderNotifications: true,
      },

      emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}#/login`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user
      ? data.session
        ? await getAuthUser(data.user)
        : mapSupabaseUser(data.user)
      : null,

    requiresEmailConfirmation: !data.session,
  };
};

export const login = async ({
  email,
  password,
}: LoginParams): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),

    password,
  });

  if (error || !data.user) {
    throw new Error("Неверный email или пароль");
  }

  return getAuthUser(data.user);
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Не удалось выйти из аккаунта");
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return getAuthUser(data.user);
};

export const updateAuthUserMetadata = async (
  data: UpdateAuthUserData,
): Promise<AuthUser> => {
  const { email, ...metadata } = data;
  const { data: result, error } = await supabase.auth.updateUser({
    ...(email ? { email: email.trim().toLowerCase() } : {}),
    data: metadata,
  });

  if (error) {
    throw new Error(error.message);
  }

  return getAuthUser(result.user);
};
