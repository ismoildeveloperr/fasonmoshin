import { ArrowRight, CalendarDays, Package } from "lucide-react";
import { Link } from "react-router-dom";

import { useOrdersQuery } from "@/entities/order";
import { getAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { Loader } from "@/shared/ui/Loader";
import { ProfileLayout } from "@/widgets/ProfileLayout";

import styles from "./OrdersPage.module.scss";

const ORDER_STATUS_LABELS = {
  new: "Новый",
  processing: "В обработке",
  delivery: "Доставка",
  completed: "Завершён",
  cancelled: "Отменён",
} as const;

export const OrdersPage = () => {
  const currentUser = getAuthUser();

  const { data: orders = [], isLoading, isError } = useOrdersQuery();

  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    return (
      <ProfileLayout
        title="Мои заказы"
        description="История и состояние ваших заказов."
      >
        <Loader text="Загружаем заказы..." />
      </ProfileLayout>
    );
  }

  if (isError) {
    return (
      <ProfileLayout
        title="Мои заказы"
        description="История и состояние ваших заказов."
      >
        <div className={styles.error}>Не удалось загрузить заказы.</div>
      </ProfileLayout>
    );
  }

  const userOrders = orders
    .filter((order) => String(order.userId) === String(currentUser.id))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <ProfileLayout
      title="Мои заказы"
      description="История и состояние ваших заказов."
    >
      {userOrders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Package size={34} />
          </div>

          <h2>Заказов пока нет</h2>

          <p>После оформления покупки ваши заказы появятся в этом разделе.</p>

          <Link to={ROUTES.catalog}>
            Перейти в каталог
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className={styles.orders}>
          {userOrders.map((order) => {
            const status = ORDER_STATUS_LABELS[order.status] ?? order.status;

            const date = new Intl.DateTimeFormat("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(order.createdAt));

            return (
              <article key={order.id} className={styles.order}>
                <div className={styles.orderMain}>
                  <div className={styles.orderIcon}>
                    <Package size={22} />
                  </div>

                  <div>
                    <span>Заказ</span>

                    <strong>#{order.id}</strong>
                  </div>
                </div>

                <div className={styles.orderInfo}>
                  <span>Дата</span>

                  <strong>
                    <CalendarDays size={14} />
                    {date}
                  </strong>
                </div>

                <div className={styles.orderInfo}>
                  <span>Статус</span>

                  <strong>{status}</strong>
                </div>

                <div className={styles.orderInfo}>
                  <span>Сумма</span>

                  <strong>{order.total} TJS</strong>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </ProfileLayout>
  );
};
