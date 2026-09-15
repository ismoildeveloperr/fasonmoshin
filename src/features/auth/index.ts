export {
  getAuthUser,
  getCurrentUser,
  login,
  logout,
  mapSupabaseUser,
  register,
  updateAuthUserMetadata,
} from "./api/authApi";

export type { AuthRole, AuthUser, RegisterResult } from "./api/authApi";

export { AuthProvider } from "./model/AuthProvider";

export { useAuth } from "./model/useAuth";
