import { createContext } from "react";

import type { Session } from "@supabase/supabase-js";

import type { AuthUser } from "../api/authApi";

export type AuthContextValue = {
  user: AuthUser | null;

  session: Session | null;

  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
