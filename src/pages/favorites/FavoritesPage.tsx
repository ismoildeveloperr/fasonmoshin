import { ArrowRight, Heart, Sparkles } from "lucide-react";

import { Link, Navigate } from "react-router-dom";

import { useFavoritesQuery } from "@/entities/favorite";

import { ProductCard, useProductsQuery } from "@/entities/product";

import { getAuthUser } from "@/features/auth";

import { ROUTES } from "@/shared/constants/routes";

import { ProfileLayout } from "@/widgets/ProfileLayout";

import styles from "./FavoritesPage.module.scss";

export const FavoritesPage = () => {
  const currentUser = getAuthUser();

  const {
    data: favorites = [],
    isLoading: favoritesLoading,
    isError: favoritesError,
  } = useFavoritesQuery();

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsQuery();

  if (!currentUser) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const favoriteProductIds = new Set(
    favorites
      .filter((favorite) => String(favorite.userId) === String(currentUser.id))
      .map((favorite) => String(favorite.productId)),
  );

  const favoriteProducts = products.filter((product) =>
    favoriteProductIds.has(String(product.id)),
  );

  const isLoading = favoritesLoading || productsLoading;

  const isError = favoritesError || productsError;

  return (
    <ProfileLayout
      title="Избранное"
      description="Сохранённые товары, к которым можно быстро вернуться."
    >
      {isLoading && <div className={styles.state}>Загружаем избранное...</div>}

      {isError && (
        <div className={`${styles.state} ${styles.error}`}>
          Не удалось загрузить избранное.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.heroIcon}>
                <Heart size={24} />
              </div>

              <div>
                <span className={styles.eyebrow}>Мои товары</span>

                <h2>Сохранённое для вас</h2>

                <p>Здесь находятся товары, которые вы добавили в избранное.</p>
              </div>
            </div>

            <div className={styles.heroStats}>
              <div>
                <span>В избранном</span>

                <strong>{favoriteProducts.length}</strong>
              </div>

              <div>
                <span>Каталог</span>

                <strong>{products.length}</strong>
              </div>
            </div>
          </section>

          {favoriteProducts.length === 0 ? (
            <section className={styles.empty}>
              <div className={styles.emptyGlow} />

              <div className={styles.emptyIcon}>
                <Heart size={34} />
              </div>

              <span className={styles.emptyBadge}>Пока пусто</span>

              <h2>Добавьте любимые товары</h2>

              <p>
                Нажимайте на сердечко в карточке товара, чтобы сохранить его
                здесь и быстро вернуться позже.
              </p>

              <Link to={ROUTES.catalog} className={styles.catalogButton}>
                Перейти в каталог
                <ArrowRight size={18} />
              </Link>
            </section>
          ) : (
            <>
              <div className={styles.sectionHeader}>
                <div>
                  <Sparkles size={16} />

                  <span>Сохранённые товары</span>
                </div>

                <p>
                  {favoriteProducts.length}{" "}
                  {favoriteProducts.length === 1 ? "товар" : "товаров"}
                </p>
              </div>

              <section className={styles.grid}>
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </section>
            </>
          )}
        </>
      )}
    </ProfileLayout>
  );
};
