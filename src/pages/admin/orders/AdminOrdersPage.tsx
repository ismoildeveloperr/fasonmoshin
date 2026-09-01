import { Eye, Package, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

import { useOrdersQuery } from "@/entities/order";

import type { Order, OrderStatus } from "@/entities/order";

import { AdminOrderDetailsModal } from "@/features/admin-order-details";
import { AdminLayout } from "@/widgets/AdminLayout";

import styles from "./AdminOrdersPage.module.scss";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  new: {
    label: "Новый",
    className: "new",
  },
  processing: {
    label: "В обработке",
    className: "processing",
  },
  delivery: {
    label: "Доставка",
    className: "delivery",
  },
  completed: {
    label: "Завершён",
    className: "completed",
  },
  cancelled: {
    label: "Отменён",
    className: "cancelled",
  },
};

export const AdminOrdersPage = () => {
  const { data: orders = [], isLoading, isError } = useOrdersQuery();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<OrderStatus | "">("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const matchesSearch =
          !query ||
          String(order.id).toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.phone.toLowerCase().includes(query);

        const matchesStatus = !status || order.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [orders, search, status]);

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + Number(order.total), 0);

  const newOrdersCount = orders.filter(
    (order) => order.status === "new",
  ).length;

  return (
    <AdminLayout title="Заказы" description="Управление заказами покупателей.">
      <div className={styles.stats}>
        <article>
          <div>
            <ShoppingBag size={20} />
          </div>

          <span>Всего заказов</span>

          <strong>{orders.length}</strong>
        </article>

        <article>
          <div>
            <Package size={20} />
          </div>

          <span>Новые</span>

          <strong>{newOrdersCount}</strong>
        </article>

        <article>
          <div>
            <ShoppingBag size={20} />
          </div>

          <span>Выручка</span>

          <strong>{totalRevenue} TJS</strong>
        </article>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={17} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Номер, имя, email или телефон..."
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as OrderStatus | "")
          }
        >
          <option value="">Все статусы</option>

          <option value="new">Новый</option>

          <option value="processing">В обработке</option>

          <option value="delivery">Доставка</option>

          <option value="completed">Завершён</option>

          <option value="cancelled">Отменён</option>
        </select>
      </div>

      {isLoading && <div className={styles.state}>Загружаем заказы...</div>}

      {isError && (
        <div className={`${styles.state} ${styles.error}`}>
          Не удалось загрузить заказы.
        </div>
      )}

      {!isLoading && !isError && filteredOrders.length === 0 && (
        <div className={styles.empty}>
          <div>
            <ShoppingBag size={30} />
          </div>

          <h2>Заказы не найдены</h2>

          <p>Здесь будут отображаться заказы покупателей.</p>
        </div>
      )}

      {!isLoading && filteredOrders.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Заказ</th>
                <th>Покупатель</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Сумма</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status];

                const date = new Intl.DateTimeFormat("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(order.createdAt));

                return (
                  <tr key={order.id}>
                    <td>
                      <div className={styles.orderNumber}>
                        <strong>#{order.id}</strong>

                        <span>{order.products.length} товаров</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.customer}>
                        <strong>{order.customerName}</strong>

                        <span>{order.phone}</span>
                      </div>
                    </td>

                    <td>{date}</td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[statusConfig.className]
                        }`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>

                    <td>
                      <strong>{order.total} TJS</strong>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.viewButton}
                        onClick={() => setSelectedOrder(order)}
                        aria-label="Открыть заказ"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminLayout>
  );
};
