import {
  ArrowRight,
  Minus,
  PackageOpen,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { Link, Navigate } from "react-router-dom";

import {
  useCartQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/entities/cart";

import { useProductsQuery } from "@/entities/product";

import type { Product } from "@/entities/product";

import { getAuthUser } from "@/features/auth";

import { ROUTES } from "@/shared/constants/routes";

import { getPublicImageUrl } from "@/shared/lib";

import styles from "./CartPage.module.scss";

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

  const updateCartItem = useUpdateCartItemMutation();

  const deleteCartItem = useDeleteCartItemMutation();

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
        ? {
            id: item.id,
            quantity: Number(item.quantity || 1),
            product,
          }
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

  const isPending = updateCartItem.isPending || deleteCartItem.isPending;

  const handleDecrease = (cartItemId: string | number, quantity: number) => {
    if (isPending) {
      return;
    }

    if (quantity <= 1) {
      deleteCartItem.mutate(cartItemId);

      return;
    }

    updateCartItem.mutate({
      id: cartItemId,
      quantity: quantity - 1,
    });
  };

  const handleIncrease = (
    cartItemId: string | number,
    quantity: number,
    stock: number,
  ) => {
    if (isPending) {
      return;
    }

    if (quantity >= stock) {
      return;
    }

    updateCartItem.mutate({
      id: cartItemId,
      quantity: quantity + 1,
    });
  };

  const handleDelete = (cartItemId: string | number) => {
    if (isPending) {
      return;
    }

    deleteCartItem.mutate(cartItemId);
  };

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
                        {product.stock > 0
                          ? `В наличии: ${product.stock} шт.`
                          : "Нет в наличии"}
                      </span>
                    </div>

                    <div
                      className={styles.quantity}
                      aria-label="Количество товара"
                    >
                      <button
                        type="button"
                        onClick={() => handleDecrease(id, quantity)}
                        disabled={isPending}
                        aria-label="Уменьшить количество"
                      >
                        <Minus size={16} />
                      </button>

                      <span>{quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handleIncrease(id, quantity, Number(product.stock))
                        }
                        disabled={
                          isPending || quantity >= Number(product.stock)
                        }
                        aria-label="Увеличить количество"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className={styles.price}>
                      <strong>{formatPrice(itemTotal)} TJS</strong>

                      {product.oldPrice && product.oldPrice > product.price && (
                        <span>
                          {formatPrice(Number(product.oldPrice) * quantity)} TJS
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleDelete(id)}
                      disabled={isPending}
                      aria-label={`Удалить ${product.name}`}
                      title="Удалить товар"
                    >
                      <Trash2 size={18} />
                    </button>
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
