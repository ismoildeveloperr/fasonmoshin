import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { Loader } from "@/shared/ui/Loader";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader text="Проверяем авторизацию..." />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
