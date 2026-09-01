import {
  ChevronRight,
  Heart,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAddressesQuery } from "@/entities/address";
import { useFavoritesQuery } from "@/entities/favorite";
import { useOrdersQuery } from "@/entities/order";
import { getAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { ProfileLayout } from "@/widgets/ProfileLayout";

import styles from "./ProfilePage.module.scss";

const ORDER_STATUS_LABELS = {
  new: "Новый",
  processing: "В обработке",
  delivery: "Доставка",
  completed: "Завершён",
  cancelled: "Отменён",
} as const;

export const ProfilePage = () => {
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

  const userOrders = orders.filter(
    (order) => String(order.userId) === String(currentUser.id),
  );

  const ordersCount = userOrders.length;

  const recentOrders = [...userOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const addressesCount = addresses.filter(
    (address) => String(address.userId) === String(currentUser.id),
  ).length;

  const registrationDate = currentUser.createdAt
    ? new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(currentUser.createdAt))
    : "Не указана";

  return (
    <ProfileLayout
      title="Профиль"
      description="Управляйте личными данными, заказами и настройками."
    >
      <div className={styles.content}>
        <section className={styles.profileCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Личные данные</span>

              <h2>Информация профиля</h2>
            </div>

            <Link to={ROUTES.settings}>Редактировать</Link>
          </div>

          <div className={styles.infoGrid}>
            <div>
              <span>Имя</span>

              <strong>{currentUser.name}</strong>
            </div>

            <div>
              <span>Телефон</span>

              <strong>{currentUser.phone || "Не указан"}</strong>
            </div>

            <div>
              <span>Email</span>

              <strong>{currentUser.email}</strong>
            </div>

            <div>
              <span>Дата регистрации</span>

              <strong>{registrationDate}</strong>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <Link to={ROUTES.orders}>
            <div className={styles.statIcon}>
              <ShoppingBag size={22} />
            </div>

            <div>
              <span>Заказы</span>

              <strong>{ordersCount}</strong>
            </div>

            <ChevronRight size={20} />
          </Link>

          <Link to={ROUTES.favorites}>
            <div className={styles.statIcon}>
              <Heart size={22} />
            </div>

            <div>
              <span>Избранное</span>

              <strong>{favoriteCount}</strong>
            </div>

            <ChevronRight size={20} />
          </Link>

          <Link to={ROUTES.addresses}>
            <div className={styles.statIcon}>
              <MapPin size={22} />
            </div>

            <div>
              <span>Адреса</span>

              <strong>{addressesCount}</strong>
            </div>

            <ChevronRight size={20} />
          </Link>
        </section>

        <section className={styles.recentOrders}>
          <div className={styles.sectionHeader}>
            <div>
              <span>История</span>

              <h2>Последние заказы</h2>
            </div>

            <Link to={ROUTES.orders}>
              Все заказы
              <ChevronRight size={17} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className={styles.emptyOrders}>
              <div>
                <Package size={30} />
              </div>

              <h3>Заказов пока нет</h3>

              <p>После оформления покупки ваши заказы появятся здесь.</p>

              <Link to={ROUTES.catalog}>Перейти в каталог</Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {recentOrders.map((order) => (
                <article key={order.id} className={styles.orderItem}>
                  <div>
                    <span>Заказ #{order.id}</span>

                    <strong>
                      {new Intl.DateTimeFormat("ru-RU").format(
                        new Date(order.createdAt),
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Статус</span>

                    <strong>{ORDER_STATUS_LABELS[order.status]}</strong>
                  </div>

                  <div>
                    <span>Сумма</span>

                    <strong>{order.total} TJS</strong>
                  </div>

                  <ChevronRight size={18} />
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProfileLayout>
  );
};
