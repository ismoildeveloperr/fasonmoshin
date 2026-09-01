import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAddressesQuery } from "@/entities/address";
import { useFavoritesQuery } from "@/entities/favorite";
import { useOrdersQuery } from "@/entities/order";
import { getAuthUser, removeAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import styles from "./ProfileSidebar.module.scss";

export const ProfileSidebar = () => {
  const navigate = useNavigate();

  const currentUser = getAuthUser();

  const { data: favorites = [] } = useFavoritesQuery();

  const { data: orders = [] } = useOrdersQuery();

  const { data: addresses = [] } = useAddressesQuery();

  if (!currentUser) {
    return null;
  }

  const favoriteCount = new Set(
    favorites
      .filter((item) => String(item.userId) === String(currentUser.id))
      .map((item) => String(item.productId)),
  ).size;

  const ordersCount = orders.filter(
    (order) => String(order.userId) === String(currentUser.id),
  ).length;

  const addressesCount = addresses.filter(
    (address) => String(address.userId) === String(currentUser.id),
  ).length;

  const handleLogout = () => {
    removeAuthUser();

    navigate(ROUTES.home);
  };

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `${styles.menuItem} ${isActive ? styles.active : ""}`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userCard}>
        <div className={styles.avatar}>
          <UserRound size={28} />
        </div>

        <div className={styles.userInfo}>
          <strong>{currentUser.name}</strong>

          <span>{currentUser.email}</span>
        </div>
      </div>

      <nav className={styles.menu}>
        <NavLink end to={ROUTES.profile} className={getLinkClassName}>
          <UserRound size={20} />

          <span>Профиль</span>
        </NavLink>

        <NavLink to={ROUTES.orders} className={getLinkClassName}>
          <Package size={20} />

          <span>Мои заказы</span>

          {ordersCount > 0 && (
            <strong className={styles.counter}>{ordersCount}</strong>
          )}
        </NavLink>

        <NavLink to={ROUTES.favorites} className={getLinkClassName}>
          <Heart size={20} />

          <span>Избранное</span>

          {favoriteCount > 0 && (
            <strong className={styles.counter}>{favoriteCount}</strong>
          )}
        </NavLink>

        <NavLink to={ROUTES.addresses} className={getLinkClassName}>
          <MapPin size={20} />

          <span>Адреса</span>

          {addressesCount > 0 && (
            <strong className={styles.counter}>{addressesCount}</strong>
          )}
        </NavLink>

        <NavLink to={ROUTES.settings} className={getLinkClassName}>
          <Settings size={20} />

          <span>Настройки</span>
        </NavLink>
      </nav>

      <button type="button" className={styles.logout} onClick={handleLogout}>
        <LogOut size={20} />

        <span>Выйти</span>
      </button>
    </aside>
  );
};
