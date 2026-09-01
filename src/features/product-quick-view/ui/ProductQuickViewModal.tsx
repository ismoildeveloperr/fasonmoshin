import {
  CheckCircle2,
  Package,
  ShieldCheck,
  Star,
  Truck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Product } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import { FavoriteButton } from "@/features/toggle-favorite";

import styles from "./ProductQuickViewModal.module.scss";

type ProductQuickViewModalProps = {
  product: Product;
  onClose: () => void;
};

export const ProductQuickViewModal = ({
  product,
  onClose,
}: ProductQuickViewModalProps) => {
  const image = product.images?.[0];

  const discountPercent =
    product.discount ??
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : undefined);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Быстрый просмотр ${product.name}`}
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Закрыть быстрый просмотр"
      />

      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={21} />
        </button>

        <div className={styles.layout}>
          <div className={styles.media}>
            <div className={styles.badges}>
              {product.isNew && <span className={styles.newBadge}>NEW</span>}

              {product.isSale && discountPercent && (
                <span className={styles.saleBadge}>−{discountPercent}%</span>
              )}

              {product.isPopular && (
                <span className={styles.popularBadge}>TOP</span>
              )}
            </div>

            {image ? (
              <img src={image} alt={product.name} />
            ) : (
              <div className={styles.placeholder}>
                <Package size={42} />
                <span>Нет изображения</span>
              </div>
            )}
          </div>

          <div className={styles.content}>
            <div className={styles.top}>
              <span className={styles.article}>Артикул: {product.article}</span>

              <span
                className={
                  product.stock > 0 ? styles.inStock : styles.outOfStock
                }
              >
                <CheckCircle2 size={14} />

                {product.stock > 0
                  ? `В наличии: ${product.stock} шт.`
                  : "Нет в наличии"}
              </span>
            </div>

            <h2>{product.name}</h2>

            <div className={styles.rating}>
              <strong>
                <Star size={17} fill="currentColor" />

                {product.rating}
              </strong>

              <span>{product.reviewsCount} отзывов</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.priceBlock}>
              <div>
                <strong>
                  {product.price}
                  <span> TJS</span>
                </strong>

                {product.oldPrice && product.oldPrice > product.price && (
                  <del>{product.oldPrice} TJS</del>
                )}
              </div>

              {discountPercent && product.isSale && (
                <span className={styles.discount}>
                  Экономия{" "}
                  {product.oldPrice ? product.oldPrice - product.price : 0} TJS
                </span>
              )}
            </div>

            <div className={styles.actions}>
              <AddToCartButton
                productId={product.id}
                disabled={product.stock <= 0}
                className={styles.cartButton}
              />

              <FavoriteButton
                productId={product.id}
                className={styles.favoriteButton}
              />
            </div>

            <Link
              to={`/product/${product.id}`}
              className={styles.detailsLink}
              onClick={onClose}
            >
              Перейти на страницу товара
            </Link>

            <div className={styles.benefits}>
              <div>
                <Truck size={19} />

                <div>
                  <strong>Доставка</strong>
                  <span>Быстрая доставка по вашему адресу</span>
                </div>
              </div>

              <div>
                <ShieldCheck size={19} />

                <div>
                  <strong>Гарантия качества</strong>
                  <span>Проверенные товары</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
