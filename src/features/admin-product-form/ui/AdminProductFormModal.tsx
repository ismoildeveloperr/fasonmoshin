import { Image, ImagePlus, Package, Trash2, X } from "lucide-react";

import { useState, type FormEvent } from "react";

import { useBrandsQuery } from "@/entities/brand";
import { useCategoriesQuery } from "@/entities/category";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/entities/product";

import type { Product } from "@/entities/product";

import { getPublicImageUrl } from "@/shared/lib/getPublicImageUrl";

import styles from "./AdminProductFormModal.module.scss";

type AdminProductFormModalProps = {
  product?: Product | null;
  onClose: () => void;
};

export const AdminProductFormModal = ({
  product,
  onClose,
}: AdminProductFormModalProps) => {
  const isEditing = Boolean(product);

  const { data: categories = [] } = useCategoriesQuery();

  const { data: brands = [] } = useBrandsQuery();

  const createProduct = useCreateProductMutation();

  const updateProduct = useUpdateProductMutation();

  /*
   * =========================
   * ОСНОВНАЯ ИНФОРМАЦИЯ
   * =========================
   */

  const [name, setName] = useState(() => product?.name ?? "");

  const [slug, setSlug] = useState(() => product?.slug ?? "");

  const [article, setArticle] = useState(() => product?.article ?? "");

  const [description, setDescription] = useState(
    () => product?.description ?? "",
  );

  /*
   * =========================
   * ЦЕНА
   * =========================
   */

  const [price, setPrice] = useState(() =>
    product?.price !== undefined ? String(product.price) : "",
  );

  const [oldPrice, setOldPrice] = useState(() =>
    product?.oldPrice !== undefined ? String(product.oldPrice) : "",
  );

  const [stock, setStock] = useState(() =>
    product?.stock !== undefined ? String(product.stock) : "",
  );

  /*
   * =========================
   * КАТАЛОГ
   * =========================
   */

  const [categorySlug, setCategorySlug] = useState(
    () => product?.categorySlug ?? "",
  );

  const [brandSlug, setBrandSlug] = useState(() => product?.brandSlug ?? "");

  const [color, setColor] = useState(() => product?.color ?? "");

  /*
   * =========================
   * ФОТО
   * =========================
   */

  const [imagePath, setImagePath] = useState(() => product?.images?.[0] ?? "");

  const [imageError, setImageError] = useState(false);

  /*
   * =========================
   * СТАТУСЫ
   * =========================
   */

  const [isNew, setIsNew] = useState(() => product?.isNew ?? false);

  const [isSale, setIsSale] = useState(() => product?.isSale ?? false);

  const [isPopular, setIsPopular] = useState(() => product?.isPopular ?? false);

  const [error, setError] = useState("");

  /*
   * =========================
   * SLUG
   * =========================
   */

  const handleNameChange = (value: string) => {
    setName(value);

    if (isEditing) {
      return;
    }

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-zа-яё0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "");

    setSlug(generatedSlug);
  };

  /*
   * =========================
   * ФОТО
   * =========================
   */

  const handleImagePathChange = (value: string) => {
    let normalizedValue = value.trim();

    /*
     * Можно написать просто:
     * product-1.jpg
     *
     * Автоматически получим:
     * /products/product-1.jpg
     */
    if (
      normalizedValue &&
      !normalizedValue.startsWith("http://") &&
      !normalizedValue.startsWith("https://") &&
      !normalizedValue.startsWith("/products/")
    ) {
      normalizedValue = `/products/${normalizedValue}`;
    }

    setImagePath(normalizedValue);
    setImageError(false);
  };

  const handleRemoveImage = () => {
    setImagePath("");
    setImageError(false);
  };

  /*
   * =========================
   * СОХРАНЕНИЕ
   * =========================
   */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const numericPrice = Number(price);

    const numericStock = Number(stock);

    if (!name.trim() || !slug.trim() || !article.trim()) {
      setError("Заполните обязательные поля.");

      return;
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Укажите корректную цену.");

      return;
    }

    if (Number.isNaN(numericStock) || numericStock < 0) {
      setError("Укажите корректное количество.");

      return;
    }

    if (!categorySlug) {
      setError("Выберите категорию.");

      return;
    }

    const numericOldPrice = oldPrice ? Number(oldPrice) : undefined;

    if (
      numericOldPrice !== undefined &&
      (Number.isNaN(numericOldPrice) || numericOldPrice < 0)
    ) {
      setError("Укажите корректную старую цену.");

      return;
    }

    const discount =
      numericOldPrice && numericOldPrice > numericPrice
        ? Math.round(((numericOldPrice - numericPrice) / numericOldPrice) * 100)
        : undefined;

    /*
     * В Mokky сохраняем:
     *
     * /products/product-1.jpg
     *
     * а НЕ полный адрес localhost.
     */
    const normalizedImagePath = imagePath.trim();

    const payload = {
      name: name.trim(),

      slug: slug.trim(),

      article: article.trim(),

      description: description.trim(),

      price: numericPrice,

      oldPrice: numericOldPrice,

      discount,

      categorySlug,

      brandSlug: brandSlug || undefined,

      images: normalizedImagePath ? [normalizedImagePath] : [],

      rating: product?.rating ?? 0,

      reviewsCount: product?.reviewsCount ?? 0,

      stock: numericStock,

      color: color.trim() || undefined,

      compatibility: product?.compatibility ?? [],

      isNew,

      isSale,

      isPopular,

      createdAt: product?.createdAt ?? new Date().toISOString(),
    };

    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: payload,
        });
      } else {
        await createProduct.mutateAsync(payload);
      }

      onClose();
    } catch (error) {
      console.error(error);

      setError("Не удалось сохранить товар.");
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  const imagePreviewUrl = imagePath ? getPublicImageUrl(imagePath) : "";

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Закрыть"
      />

      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <span>{isEditing ? "Редактирование" : "Новый товар"}</span>

            <h2>{isEditing ? "Редактировать товар" : "Добавить товар"}</h2>
          </div>

          <button type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* =====================
              ОСНОВНАЯ ИНФОРМАЦИЯ
          ===================== */}

          <section>
            <div className={styles.sectionTitle}>
              <Package size={18} />

              <div>
                <strong>Основная информация</strong>

                <span>Название, артикул и описание</span>
              </div>
            </div>

            <div className={styles.grid}>
              <label className={styles.full}>
                <span>Название товара *</span>

                <input
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Название товара"
                  required
                />
              </label>

              <label>
                <span>Slug *</span>

                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="product-slug"
                  required
                />
              </label>

              <label>
                <span>Артикул *</span>

                <input
                  value={article}
                  onChange={(event) => setArticle(event.target.value)}
                  placeholder="FM-001"
                  required
                />
              </label>

              <label className={styles.full}>
                <span>Описание</span>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Описание товара..."
                  rows={5}
                />
              </label>
            </div>
          </section>

          {/* =====================
              ЦЕНА И КАТАЛОГ
          ===================== */}

          <section>
            <div className={styles.sectionTitle}>
              <Image size={18} />

              <div>
                <strong>Цена и каталог</strong>

                <span>Стоимость, остаток и принадлежность</span>
              </div>
            </div>

            <div className={styles.grid}>
              <label>
                <span>Цена *</span>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="120"
                  required
                />
              </label>

              <label>
                <span>Старая цена</span>

                <input
                  type="number"
                  min="0"
                  value={oldPrice}
                  onChange={(event) => setOldPrice(event.target.value)}
                  placeholder="150"
                />
              </label>

              <label>
                <span>Остаток *</span>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="10"
                  required
                />
              </label>

              <label>
                <span>Цвет</span>

                <input
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  placeholder="Чёрный"
                />
              </label>

              <label>
                <span>Категория *</span>

                <select
                  value={categorySlug}
                  onChange={(event) => setCategorySlug(event.target.value)}
                  required
                >
                  <option value="">Выберите категорию</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Бренд</span>

                <select
                  value={brandSlug}
                  onChange={(event) => setBrandSlug(event.target.value)}
                >
                  <option value="">Без бренда</option>

                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.slug}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* =====================
              ИЗОБРАЖЕНИЕ
          ===================== */}

          <section>
            <div className={styles.sectionTitle}>
              <ImagePlus size={18} />

              <div>
                <strong>Изображение товара</strong>

                <span>Файл из public/products</span>
              </div>
            </div>

            <div className={styles.imageSection}>
              <label className={styles.imagePathField}>
                <span>Имя файла</span>

                <input
                  type="text"
                  value={imagePath}
                  onChange={(event) =>
                    handleImagePathChange(event.target.value)
                  }
                  placeholder="product-1.jpg"
                />

                <small>
                  Например: product-1.jpg или /products/product-1.jpg
                </small>
              </label>

              {imagePreviewUrl && !imageError && (
                <div className={styles.imagePreview}>
                  <div className={styles.previewImage}>
                    <img
                      src={imagePreviewUrl}
                      alt={name || "Изображение товара"}
                      onLoad={() => setImageError(false)}
                      onError={() => setImageError(true)}
                    />
                  </div>

                  <div className={styles.previewInfo}>
                    <div>
                      <strong>Изображение найдено</strong>

                      <span>{imagePath}</span>
                    </div>

                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={handleRemoveImage}
                    >
                      <Trash2 size={16} />
                      Удалить
                    </button>
                  </div>
                </div>
              )}

              {imagePath && imageError && (
                <div className={styles.imageNotFound}>
                  <ImagePlus size={22} />

                  <div>
                    <strong>Изображение не найдено</strong>

                    <span>Проверь, что файл находится в public/products</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =====================
              СТАТУСЫ
          ===================== */}

          <section>
            <div className={styles.flags}>
              <label>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(event) => setIsNew(event.target.checked)}
                />

                <span>Новинка</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={isSale}
                  onChange={(event) => setIsSale(event.target.checked)}
                />

                <span>Акция</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(event) => setIsPopular(event.target.checked)}
                />

                <span>Популярный</span>
              </label>
            </div>
          </section>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={onClose}
              disabled={isPending}
            >
              Отмена
            </button>

            <button
              type="submit"
              className={styles.submit}
              disabled={isPending}
            >
              {isPending
                ? "Сохраняем..."
                : isEditing
                  ? "Сохранить изменения"
                  : "Добавить товар"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
