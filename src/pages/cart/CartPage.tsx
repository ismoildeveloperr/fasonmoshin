import { ArrowRight, PackageOpen, ShoppingBag } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import { useCartQuery } from "@/entities/cart";
import { useProductsQuery } from "@/entities/product";
import type { Product } from "@/entities/product";
import { getAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";

import styles from "./CartPage.module.scss";
import { getPublicImageUrl } from "@/shared/lib";

type CartProductItem = {
  id: string | number;
  quantity: number;
  product: Product;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value);

export const CartPage = () => {
  const currentUser = getAuthUser();
  const {
    data: cart = [],
    isLoading: cartLoading,
    isError: cartError,
  } = useCartQuery();
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsQuery();

  if (!currentUser) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const cartProducts: CartProductItem[] = cart
    .filter((item) => String(item.userId) === String(currentUser.id))
    .map((item) => {
      const product = products.find(
        (productItem) => String(productItem.id) === String(item.productId),
      );

      return product
        ? { id: item.id, quantity: Number(item.quantity || 1), product }
        : null;
    })
    .filter((item): item is CartProductItem => item !== null);

  const totalQuantity = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const totalPrice = cartProducts.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );
  const isLoading = cartLoading || productsLoading;
  const isError = cartError || productsError;

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <span>Ваш заказ</span>
          <h1>Корзина</h1>
          <p>{totalQuantity} товаров</p>
        </div>

        {isLoading && <div className={styles.empty}>Загружаем корзину...</div>}

        {isError && (
          <div className={`${styles.empty} ${styles.error}`}>
            Не удалось загрузить корзину. Попробуйте обновить страницу.
          </div>
        )}

        {!isLoading && !isError && cartProducts.length === 0 && (
          <section className={styles.empty}>
            <div className={styles.emptyIcon}>
              <PackageOpen size={34} />
            </div>
            <h2>Корзина пока пустая</h2>
            <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
            <Link to={ROUTES.catalog}>
              Перейти в каталог
              <ArrowRight size={18} />
            </Link>
          </section>
        )}

        {!isLoading && !isError && cartProducts.length > 0 && (
          <div className={styles.layout}>
            <section className={styles.products}>
              {cartProducts.map(({ id, product, quantity }) => {
                const itemTotal = Number(product.price) * quantity;

                return (
                  <article key={id} className={styles.productCard}>
                    <div className={styles.imageContainer}>
                      {product.images?.[0] ? (
                        <img
                          src={getPublicImageUrl(product.images?.[0])}
                          alt={product.name}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <ShoppingBag size={28} />
                        </div>
                      )}
                    </div>

                    <div className={styles.productInfo}>
                      <span className={styles.article}>
                        Артикул: {product.article}
                      </span>
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                      <span
                        className={
                          product.stock > 0 ? styles.inStock : styles.outOfStock
                        }
                      >
                        {product.stock > 0 ? "В наличии" : "Нет в наличии"}
                      </span>
                    </div>

                    <div
                      className={styles.quantity}
                      aria-label="Количество товара"
                    >
                      <span>{quantity}</span>
                    </div>

                    <div className={styles.price}>
                      <strong>{formatPrice(itemTotal)} TJS</strong>
                      {product.oldPrice && (
                        <span>{formatPrice(Number(product.oldPrice))} TJS</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className={styles.summary}>
              <span className={styles.summaryLabel}>Ваш заказ</span>
              <h2>Итого</h2>
              <div className={styles.summaryRows}>
                <div>
                  <span>Товаров</span>
                  <strong>{totalQuantity}</strong>
                </div>
              </div>
              <div className={styles.total}>
                <span>К оплате</span>
                <strong>{formatPrice(totalPrice)} TJS</strong>
              </div>
              <Link to={ROUTES.checkout} className={styles.checkoutButton}>
                Оформить заказ
                <ArrowRight size={18} />
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};
