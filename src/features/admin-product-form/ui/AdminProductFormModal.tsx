import { Image, Package, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { useBrandsQuery } from "@/entities/brand";
import { useCategoriesQuery } from "@/entities/category";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/entities/product";

import type { Product } from "@/entities/product";

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

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [article, setArticle] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");

  const [stock, setStock] = useState("");

  const [categorySlug, setCategorySlug] = useState("");

  const [brandSlug, setBrandSlug] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [color, setColor] = useState("");

  const [isNew, setIsNew] = useState(false);

  const [isSale, setIsSale] = useState(false);

  const [isPopular, setIsPopular] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!product) {
      return;
    }

    setName(product.name);
    setSlug(product.slug);
    setArticle(product.article);
    setDescription(product.description);

    setPrice(String(product.price));

    setOldPrice(product.oldPrice ? String(product.oldPrice) : "");

    setStock(String(product.stock));

    setCategorySlug(product.categorySlug);

    setBrandSlug(product.brandSlug ?? "");

    setImageUrl(product.images?.[0] ?? "");

    setColor(product.color ?? "");

    setIsNew(product.isNew);
    setIsSale(product.isSale);
    setIsPopular(product.isPopular);
  }, [product]);

  const handleNameChange = (value: string) => {
    setName(value);

    if (!isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^\wа-яё]+/gi, "-")
        .replace(/^-+|-+$/g, "");

      setSlug(generatedSlug);
    }
  };

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

    const discount =
      numericOldPrice && numericOldPrice > numericPrice
        ? Math.round(((numericOldPrice - numericPrice) / numericOldPrice) * 100)
        : undefined;

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

      images: imageUrl.trim() ? [imageUrl.trim()] : [],

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
    } catch {
      setError("Не удалось сохранить товар.");
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

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
            <span>{isEditing ? "Редактирование" : "Новый товар"}</span>

            <h2>{isEditing ? "Редактировать товар" : "Добавить товар"}</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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

              <label className={styles.full}>
                <span>URL изображения</span>

                <input
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://..."
                />
              </label>
            </div>
          </section>

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
            <button type="button" className={styles.cancel} onClick={onClose}>
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
