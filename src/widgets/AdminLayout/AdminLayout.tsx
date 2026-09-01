import type { ReactNode } from "react";

import { Navigate, NavLink } from "react-router-dom";

import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";

import { getAuthUser, removeAuthUser } from "@/features/auth";

import { ROUTES } from "@/shared/constants/routes";

import styles from "./AdminLayout.module.scss";

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const ADMIN_NAVIGATION = [
  {
    label: "Главная",
    to: ROUTES.admin,
    icon: LayoutDashboard,
  },
  {
    label: "Товары",
    to: ROUTES.adminProducts,
    icon: Package,
  },
  {
    label: "Категории",
    to: ROUTES.adminCategories,
    icon: Boxes,
  },
  {
    label: "Бренды",
    to: ROUTES.adminBrands,
    icon: Tags,
  },
  {
    label: "Заказы",
    to: ROUTES.adminOrders,
    icon: ShoppingBag,
  },
  {
    label: "Пользователи",
    to: ROUTES.adminUsers,
    icon: Users,
  },
];

export const AdminLayout = ({
  children,
  title,
  description,
}: AdminLayoutProps) => {
  const currentUser = getAuthUser();

  if (!currentUser) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to={ROUTES.home} replace />;
  }

  const handleLogout = () => {
    removeAuthUser();

    window.location.href = ROUTES.login;
  };

  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>FasonMoshin</div>

        <nav className={styles.navigation}>
          {ADMIN_NAVIGATION.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.admin}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ""}`
                }
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{currentUser.name}</strong>

              <span>Администратор</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={styles.logout}
          >
            <LogOut size={17} />
            Выйти
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            {title && <h1>{title}</h1>}

            {description && <p>{description}</p>}
          </div>
        </div>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};
