import { Mail, MapPin, Package, Phone, UserRound, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import { useUpdateOrderMutation } from "@/entities/order";

import type { Order, OrderStatus } from "@/entities/order";

import styles from "./AdminOrderDetailsModal.module.scss";

type AdminOrderDetailsModalProps = {
  order: Order;
  onClose: () => void;
};

const STATUS_OPTIONS: {
  value: OrderStatus;
  label: string;
}[] = [
  {
    value: "new",
    label: "Новый",
  },
  {
    value: "processing",
    label: "В обработке",
  },
  {
    value: "delivery",
    label: "Доставка",
  },
  {
    value: "completed",
    label: "Завершён",
  },
  {
    value: "cancelled",
    label: "Отменён",
  },
];

export const AdminOrderDetailsModal = ({
  order,
  onClose,
}: AdminOrderDetailsModalProps) => {
  const updateOrder = useUpdateOrderMutation();

  const [status, setStatus] = useState<OrderStatus>(order.status);

  const [error, setError] = useState("");

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value as OrderStatus);
  };

  const handleSaveStatus = async () => {
    setError("");

    try {
      await updateOrder.mutateAsync({
        id: order.id,
        data: {
          status,
        },
      });

      onClose();
    } catch {
      setError("Не удалось изменить статус заказа.");
    }
  };

  const date = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(order.createdAt));

  const fullAddress = order.address
    ? [
        order.address.city,
        order.address.street,
        order.address.house ? `д. ${order.address.house}` : null,
        order.address.apartment ? `кв. ${order.address.apartment}` : null,
      ]
        .filter(Boolean)
        .join(", ")
    : "Самовывоз";

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Закрыть"
      />

      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div>
            <span>Заказ #{order.id}</span>

            <h2>Детали заказа</h2>

            <p>{date}</p>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3>Покупатель</h3>

            <div className={styles.customer}>
              <div>
                <UserRound size={18} />

                <span>{order.customerName}</span>
              </div>

              <div>
                <Phone size={18} />

                <span>{order.phone}</span>
              </div>

              <div>
                <Mail size={18} />

                <span>{order.email}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Доставка</h3>

            <div className={styles.delivery}>
              <MapPin size={18} />

              <div>
                <strong>
                  {order.deliveryMethod === "courier" ? "Курьер" : "Самовывоз"}
                </strong>

                <span>{fullAddress}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Товары</h3>

            <div className={styles.products}>
              {order.products.map((product) => (
                <div key={product.productId} className={styles.product}>
                  <div className={styles.productImage}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <strong>{product.name}</strong>

                    <span>
                      {product.quantity} × {product.price} TJS
                    </span>
                  </div>

                  <strong>{product.price * product.quantity} TJS</strong>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3>Сумма</h3>

            <div className={styles.summary}>
              <div>
                <span>Товары</span>
                <strong>{order.productsPrice} TJS</strong>
              </div>

              {order.discount > 0 && (
                <div>
                  <span>Скидка</span>
                  <strong>−{order.discount} TJS</strong>
                </div>
              )}

              <div>
                <span>Доставка</span>
                <strong>
                  {order.deliveryPrice === 0
                    ? "Бесплатно"
                    : `${order.deliveryPrice} TJS`}
                </strong>
              </div>

              <div className={styles.total}>
                <span>Итого</span>
                <strong>{order.total} TJS</strong>
              </div>
            </div>
          </section>

          {order.comment && (
            <section className={styles.section}>
              <h3>Комментарий</h3>

              <p className={styles.comment}>{order.comment}</p>
            </section>
          )}

          <section className={styles.section}>
            <h3>Статус заказа</h3>

            <div className={styles.statusControl}>
              <select value={status} onChange={handleStatusChange}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={updateOrder.isPending || status === order.status}
              >
                {updateOrder.isPending ? "Сохраняем..." : "Сохранить статус"}
              </button>
            </div>
          </section>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
};
