import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { Loader } from "@/shared/ui/Loader";

export const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader text="Проверяем права доступа..." />;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
};
