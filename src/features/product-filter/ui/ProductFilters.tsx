import { useBrandsQuery } from "@/entities/brand";
import { useCategoriesQuery } from "@/entities/category";

import styles from "./ProductFilters.module.scss";

type ProductFiltersProps = {
  categorySlug?: string;
  brandSlugs: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;

  onCategoryChange: (categorySlug?: string) => void;
  onBrandChange: (brandSlug: string) => void;
  onMinPriceChange: (value?: number) => void;
  onMaxPriceChange: (value?: number) => void;
  onInStockChange: (value: boolean) => void;
  onNewChange: (value: boolean) => void;
  onSaleChange: (value: boolean) => void;
  onReset: () => void;
};

export const ProductFilters = ({
  categorySlug,
  brandSlugs,
  minPrice,
  maxPrice,
  inStock,
  isNew,
  isSale,
  onCategoryChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onNewChange,
  onSaleChange,
  onReset,
}: ProductFiltersProps) => {
  const { data: categories = [] } = useCategoriesQuery();
  const { data: brands = [] } = useBrandsQuery();

  return (
    <aside className={styles.filters}>
      <div className={styles.header}>
        <h2>Фильтры</h2>

        <button type="button" onClick={onReset}>
          Сбросить
        </button>
      </div>

      <section className={styles.section}>
        <h3>Категории</h3>

        <label>
          <input
            type="radio"
            name="category"
            checked={!categorySlug}
            onChange={() => onCategoryChange(undefined)}
          />

          <span>Все категории</span>
        </label>

        {categories.map((category) => (
          <label key={category.slug}>
            <input
              type="radio"
              name="category"
              checked={categorySlug === category.slug}
              onChange={() => onCategoryChange(category.slug)}
            />

            <span>{category.name}</span>
          </label>
        ))}
      </section>

      <section className={styles.section}>
        <h3>Бренды</h3>

        {brands.map((brand) => (
          <label key={brand.slug}>
            <input
              type="checkbox"
              checked={brandSlugs.includes(brand.slug)}
              onChange={() => onBrandChange(brand.slug)}
            />

            <span>{brand.name}</span>
          </label>
        ))}
      </section>

      <section className={styles.section}>
        <h3>Цена</h3>

        <div className={styles.price}>
          <input
            type="number"
            value={minPrice ?? ""}
            placeholder="От"
            onChange={(event) =>
              onMinPriceChange(
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
          />

          <span>—</span>

          <input
            type="number"
            value={maxPrice ?? ""}
            placeholder="До"
            onChange={(event) =>
              onMaxPriceChange(
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Дополнительно</h3>

        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) => onInStockChange(event.target.checked)}
          />
          Только в наличии
        </label>

        <label>
          <input
            type="checkbox"
            checked={isNew}
            onChange={(event) => onNewChange(event.target.checked)}
          />
          Новинки
        </label>

        <label>
          <input
            type="checkbox"
            checked={isSale}
            onChange={(event) => onSaleChange(event.target.checked)}
          />
          Со скидкой
        </label>
      </section>
    </aside>
  );
};
