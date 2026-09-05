import { useMemo } from "react";

import {
  AlertTriangle,
  Box,
  CircleDollarSign,
  Package,
  ReceiptText,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useOrdersQuery } from "@/entities/order";

import type { Order, OrderStatus } from "@/entities/order";

import { useProductsQuery } from "@/entities/product";

import type { Product } from "@/entities/product";

import { useUsersQuery } from "@/entities/user";

import type { User } from "@/entities/user";

import { AdminLayout } from "@/widgets/AdminLayout";

import styles from "./AdminDashboardPage.module.scss";
import { getPublicImageUrl } from "@/shared/lib";

type TopProduct = {
  productId: string | number;
  name: string;
  quantity: number;
  revenue: number;
};

type SalesChartItem = {
  date: string;
  revenue: number;
  orders: number;
};

type StatusChartItem = {
  status: string;
  value: number;
  color: string;
};

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
  }
> = {
  new: {
    label: "Новые",
    color: "#111111",
  },

  processing: {
    label: "В обработке",
    color: "#f5a623",
  },

  delivery: {
    label: "Доставка",
    color: "#4a90e2",
  },

  completed: {
    label: "Завершённые",
    color: "#27ae60",
  },

  cancelled: {
    label: "Отменённые",
    color: "#e74c3c",
  },
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("ru-RU").format(value);
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const getStartOfDay = (date: Date) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

export const AdminDashboardPage = () => {
  const { data: productsData, isLoading: productsLoading } = useProductsQuery();

  const { data: ordersData, isLoading: ordersLoading } = useOrdersQuery();

  const { data: usersData, isLoading: usersLoading } = useUsersQuery();

  const products: Product[] = productsData ?? [];

  const orders: Order[] = ordersData ?? [];

  const users: User[] = usersData ?? [];

  const isLoading = productsLoading || ordersLoading || usersLoading;

  /**
   * Все заказы кроме отменённых.
   */
  const activeOrders = useMemo<Order[]>(() => {
    return orders.filter((order: Order) => order.status !== "cancelled");
  }, [orders]);

  /**
   * Общая выручка.
   */
  const totalRevenue = useMemo<number>(() => {
    return activeOrders.reduce(
      (total: number, order: Order) => total + Number(order.total || 0),
      0,
    );
  }, [activeOrders]);

  /**
   * Средний чек.
   */
  const averageOrderValue =
    activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;

  /**
   * Количество новых заказов.
   */
  const newOrdersCount = orders.filter(
    (order: Order) => order.status === "new",
  ).length;

  /**
   * Выручка сегодня.
   */
  const todayRevenue = useMemo<number>(() => {
    const today = getStartOfDay(new Date());

    return activeOrders
      .filter((order: Order) => {
        const orderDate = getStartOfDay(new Date(order.createdAt));

        return orderDate.getTime() === today.getTime();
      })
      .reduce(
        (total: number, order: Order) => total + Number(order.total || 0),
        0,
      );
  }, [activeOrders]);

  /**
   * График последних 7 дней.
   */
  const salesChartData = useMemo<SalesChartItem[]>(() => {
    const result: SalesChartItem[] = [];

    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date();

      date.setDate(date.getDate() - index);

      const dayStart = getStartOfDay(date);

      const dayOrders = activeOrders.filter((order: Order) => {
        const orderDate = getStartOfDay(new Date(order.createdAt));

        return orderDate.getTime() === dayStart.getTime();
      });

      const revenue = dayOrders.reduce(
        (total: number, order: Order) => total + Number(order.total || 0),
        0,
      );

      result.push({
        date: new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        }).format(date),

        revenue,

        orders: dayOrders.length,
      });
    }

    return result;
  }, [activeOrders]);

  /**
   * Статусы заказов.
   */
  const statusChartData = useMemo<StatusChartItem[]>(() => {
    const statuses = Object.keys(STATUS_CONFIG) as OrderStatus[];

    return statuses.map((status: OrderStatus) => {
      const config = STATUS_CONFIG[status];

      return {
        status: config.label,

        value: orders.filter((order: Order) => order.status === status).length,

        color: config.color,
      };
    });
  }, [orders]);

  /**
   * ТОП-5 товаров
   * по количеству продаж.
   */
  const topProducts = useMemo<TopProduct[]>(() => {
    const productSales = new Map<string, TopProduct>();

    activeOrders.forEach((order: Order) => {
      order.products.forEach((item) => {
        const key = String(item.productId);

        const quantity = Number(item.quantity || 0);

        const revenue = Number(item.price || 0) * quantity;

        const current = productSales.get(key);

        if (current) {
          productSales.set(key, {
            ...current,

            quantity: current.quantity + quantity,

            revenue: current.revenue + revenue,
          });

          return;
        }

        productSales.set(key, {
          productId: item.productId,

          name: item.name,

          quantity,

          revenue,
        });
      });
    });

    return Array.from(productSales.values())
      .sort((a: TopProduct, b: TopProduct) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [activeOrders]);

  /**
   * Товары с остатком <= 5.
   */
  const lowStockProducts = useMemo<Product[]>(() => {
    return [...products]
      .filter((product: Product) => Number(product.stock) <= 5)
      .sort((a: Product, b: Product) => Number(a.stock) - Number(b.stock))
      .slice(0, 5);
  }, [products]);

  /**
   * Последние заказы.
   */
  const recentOrders = useMemo<Order[]>(() => {
    return [...orders]
      .sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6);
  }, [orders]);

  if (isLoading) {
    return (
      <AdminLayout
        title="Главная"
        description="Обзор интернет-магазина FasonMoshin."
      >
        <div className={styles.loading}>Загружаем статистику...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Главная"
      description="Полная статистика магазина FasonMoshin."
    >
      {/* =========================
          STATISTICS
      ========================= */}

      <section className={styles.stats}>
        {/* REVENUE */}
        <article className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <CircleDollarSign size={21} />
            </div>

            <div className={styles.positive}>
              <TrendingUp size={13} />
              Выручка
            </div>
          </div>

          <span>Общая выручка</span>

          <strong>{formatMoney(totalRevenue)} TJS</strong>

          <small>Сегодня: {formatMoney(todayRevenue)} TJS</small>
        </article>

        {/* ORDERS */}
        <article className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <ShoppingBag size={21} />
            </div>

            {newOrdersCount > 0 && (
              <div className={styles.warning}>{newOrdersCount} новых</div>
            )}
          </div>

          <span>Заказы</span>

          <strong>{orders.length}</strong>

          <small>Активных: {activeOrders.length}</small>
        </article>

        {/* AVERAGE */}
        <article className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <ReceiptText size={21} />
            </div>
          </div>

          <span>Средний чек</span>

          <strong>{formatMoney(Math.round(averageOrderValue))} TJS</strong>

          <small>На один заказ</small>
        </article>

        {/* PRODUCTS */}
        <article className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <Box size={21} />
            </div>
          </div>

          <span>Товары</span>

          <strong>{products.length}</strong>

          <small>Заканчиваются: {lowStockProducts.length}</small>
        </article>

        {/* USERS */}
        <article className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <Users size={21} />
            </div>
          </div>

          <span>Пользователи</span>

          <strong>{users.length}</strong>

          <small>Зарегистрировано</small>
        </article>
      </section>

      {/* =========================
          SALES + ORDER STATUS
      ========================= */}

      <section className={styles.dashboardGrid}>
        {/* SALES CHART */}
        <article className={styles.largeCard}>
          <div className={styles.cardHeader}>
            <div>
              <span>ANALYTICS</span>

              <h2>Продажи за 7 дней</h2>

              <p>Выручка магазина по дням</p>
            </div>

            <div className={styles.chartSummary}>
              <span>Общая выручка</span>

              <strong>{formatMoney(totalRevenue)} TJS</strong>
            </div>
          </div>

          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eeeeee"
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#999",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#999",
                    fontSize: 10,
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Выручка"
                  stroke="#111111"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* ORDER STATUS */}
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span>ORDERS</span>

              <h2>Статусы заказов</h2>

              <p>Распределение всех заказов</p>
            </div>
          </div>

          <div className={styles.pieChart}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  fill="#111111"
                />

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className={styles.pieCenter}>
              <strong>{orders.length}</strong>

              <span>заказов</span>
            </div>
          </div>

          <div className={styles.legend}>
            {statusChartData.map((item: StatusChartItem) => (
              <div key={item.status}>
                <span
                  style={{
                    background: item.color,
                  }}
                />

                <p>{item.status}</p>

                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* =========================
          TOP PRODUCTS + STOCK
      ========================= */}

      <section className={styles.dashboardGrid}>
        {/* TOP PRODUCTS */}
        <article className={styles.largeCard}>
          <div className={styles.cardHeader}>
            <div>
              <span>PRODUCTS</span>

              <h2>Лучшие товары</h2>

              <p>ТОП-5 по количеству проданных единиц</p>
            </div>

            <TrendingUp size={22} />
          </div>

          {topProducts.length > 0 ? (
            <div className={styles.barChart}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{
                    left: 20,
                    right: 20,
                  }}
                >
                  <CartesianGrid horizontal={false} stroke="#eee" />

                  <XAxis type="number" axisLine={false} tickLine={false} />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="quantity"
                    name="Продано"
                    fill="#111111"
                    radius={[0, 7, 7, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={styles.emptyChart}>Пока нет данных о продажах.</div>
          )}
        </article>

        {/* LOW STOCK */}
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span>STOCK</span>

              <h2>Низкий остаток</h2>

              <p>Требуется пополнение</p>
            </div>

            <AlertTriangle size={21} />
          </div>

          <div className={styles.stockList}>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product: Product) => (
                <div key={product.id} className={styles.stockItem}>
                  <div className={styles.productImage}>
                    {product.images?.[0] ? (
                      <img
                        src={getPublicImageUrl(product.images?.[0])}
                        alt={product.name}
                      />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>

                  <div>
                    <strong>{product.name}</strong>

                    <span>{product.article}</span>
                  </div>

                  <div
                    className={
                      Number(product.stock) === 0
                        ? styles.outOfStock
                        : styles.stockCount
                    }
                  >
                    {product.stock} шт.
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptySmall}>Все товары в наличии</div>
            )}
          </div>
        </article>
      </section>

      {/* =========================
          RECENT ORDERS + LEADERS
      ========================= */}

      <section className={styles.bottomGrid}>
        {/* RECENT ORDERS */}
        <article className={styles.largeCard}>
          <div className={styles.cardHeader}>
            <div>
              <span>RECENT</span>

              <h2>Последние заказы</h2>

              <p>Последние операции магазина</p>
            </div>
          </div>

          {recentOrders.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Заказ</th>

                    <th>Покупатель</th>

                    <th>Дата</th>

                    <th>Статус</th>

                    <th>Сумма</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order: Order) => {
                    const config = STATUS_CONFIG[order.status];

                    return (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>

                        <td>
                          <div className={styles.customer}>
                            <strong>{order.customerName}</strong>

                            <span>{order.phone}</span>
                          </div>
                        </td>

                        <td>{formatDate(order.createdAt)}</td>

                        <td>
                          <span
                            className={styles.orderStatus}
                            style={{
                              color: config.color,
                            }}
                          >
                            {config.label}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatMoney(Number(order.total))} TJS
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptySmall}>Заказов пока нет</div>
          )}
        </article>

        {/* SALES LEADERS */}
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span>RANKING</span>

              <h2>Лидеры продаж</h2>

              <p>Выручка по товарам</p>
            </div>
          </div>

          <div className={styles.leaderList}>
            {topProducts.map((product: TopProduct, index: number) => (
              <div key={product.productId} className={styles.leader}>
                <div className={styles.rank}>{index + 1}</div>

                <div>
                  <strong>{product.name}</strong>

                  <span>{product.quantity} продано</span>
                </div>

                <strong>{formatMoney(product.revenue)} TJS</strong>
              </div>
            ))}

            {topProducts.length === 0 && (
              <div className={styles.emptySmall}>Продаж пока нет</div>
            )}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
};
