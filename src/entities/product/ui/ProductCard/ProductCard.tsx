import { useState } from "react";

import { Sparkles, Star, TrendingUp } from "lucide-react";

import { AddToCartButton } from "@/features/add-to-cart";
import { ProductQuickViewModal } from "@/features/product-quick-view";
import { FavoriteButton } from "@/features/toggle-favorite";

import type { Product } from "../../model/types";

import styles from "./ProductCard.module.scss";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const image = product.images?.[0];

  const discountPercent =
    product.discount ??
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : undefined);

  const handleOpenQuickView = () => {
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
  };

  return (
    <>
      <article className={styles.card}>
        <div className={styles.media}>
          <button
            type="button"
            className={styles.imageLink}
            onClick={handleOpenQuickView}
          >
            {image ? (
              <img
                src={image}
                alt={product.name}
                className={styles.image}
                loading="lazy"
              />
            ) : (
              <div className={styles.placeholder}>Нет изображения</div>
            )}
          </button>

          <div className={styles.badges}>
            {product.isNew && (
              <span className={`${styles.badge} ${styles.newBadge}`}>
                <Sparkles size={12} />
                NEW
              </span>
            )}

            {product.isSale && discountPercent && (
              <span className={`${styles.badge} ${styles.saleBadge}`}>
                −{discountPercent}%
              </span>
            )}

            {product.isPopular && (
              <span className={`${styles.badge} ${styles.popularBadge}`}>
                <TrendingUp size={12} />
                TOP
              </span>
            )}
          </div>

          <FavoriteButton
            productId={product.id}
            className={styles.favoriteButton}
          />

          <div className={styles.quickActions}>
            <button type="button" onClick={handleOpenQuickView}>
              Быстрый просмотр
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.meta}>
            <span className={styles.article}>{product.article}</span>

            <span
              className={product.stock > 0 ? styles.inStock : styles.outOfStock}
            >
              {product.stock > 0 ? "В наличии" : "Нет в наличии"}
            </span>
          </div>

          <button
            type="button"
            className={styles.title}
            onClick={handleOpenQuickView}
          >
            {product.name}
          </button>

          <div className={styles.rating}>
            <span className={styles.ratingValue}>
              <Star size={15} fill="currentColor" />

              {product.rating}
            </span>

            <span className={styles.reviews}>
              {product.reviewsCount} отзывов
            </span>
          </div>

          <div className={styles.footer}>
            <div className={styles.priceBlock}>
              <div className={styles.currentPrice}>
                {product.price} <span>TJS</span>
              </div>

              {product.oldPrice && product.oldPrice > product.price && (
                <div className={styles.oldPrice}>{product.oldPrice} TJS</div>
              )}
            </div>

            <AddToCartButton
              productId={product.id}
              disabled={product.stock <= 0}
              className={styles.cartButton}
            />
          </div>
        </div>
      </article>

      {isQuickViewOpen && (
        <ProductQuickViewModal
          product={product}
          onClose={handleCloseQuickView}
        />
      )}
    </>
  );
};
