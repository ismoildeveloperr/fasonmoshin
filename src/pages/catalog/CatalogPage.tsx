import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { ProductCard, useProductsQuery } from "@/entities/product";
import { ProductFilters } from "@/features/product-filter";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Loader } from "@/shared/ui/Loader";

import styles from "./CatalogPage.module.scss";

type SortType = "popular" | "price-asc" | "price-desc" | "rating" | "new";

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProductsQuery();

  const search = searchParams.get("search") ?? "";

  const categorySlug = searchParams.get("category") ?? undefined;

  const brandSlugs = searchParams.get("brands")
    ? searchParams.get("brands")!.split(",")
    : [];

  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;

  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  const inStock = searchParams.get("inStock") === "true";
  const isNew = searchParams.get("isNew") === "true";
  const isSale = searchParams.get("isSale") === "true";
  const isPopular = searchParams.get("isPopular") === "true";

  const sort = (searchParams.get("sort") as SortType | null) ?? "popular";

  const isSpecialCatalog = isNew || isSale || isPopular;

  const pageTitle = isNew
    ? "Новинки"
    : isSale
      ? "Акции"
      : isPopular
        ? "Популярные товары"
        : "Каталог товаров";

  const updateParam = (key: string, value?: string | number | boolean) => {
    const params = new URLSearchParams(searchParams);

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    setSearchParams(params);
  };

  const handleBrandChange = (brandSlug: string) => {
    const nextBrandSlugs = brandSlugs.includes(brandSlug)
      ? brandSlugs.filter((slug) => slug !== brandSlug)
      : [...brandSlugs, brandSlug];

    const params = new URLSearchParams(searchParams);

    if (nextBrandSlugs.length > 0) {
      params.set("brands", nextBrandSlugs.join(","));
    } else {
      params.delete("brands");
    }

    setSearchParams(params);
  };

  const handleReset = () => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (isNew) {
      params.set("isNew", "true");
    }

    if (isSale) {
      params.set("isSale", "true");
    }

    if (isPopular) {
      params.set("isPopular", "true");
    }

    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.article.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        !categorySlug || product.categorySlug === categorySlug;

      const matchesBrand =
        brandSlugs.length === 0 ||
        (product.brandSlug && brandSlugs.includes(product.brandSlug));

      const matchesMinPrice =
        minPrice === undefined || product.price >= minPrice;

      const matchesMaxPrice =
        maxPrice === undefined || product.price <= maxPrice;

      const matchesStock = !inStock || product.stock > 0;

      const matchesNew = !isNew || product.isNew;

      const matchesSale = !isSale || product.isSale;

      const matchesPopular = !isPopular || product.isPopular;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesStock &&
        matchesNew &&
        matchesSale &&
        matchesPopular
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;

        case "price-desc":
          return b.price - a.price;

        case "rating":
          return b.rating - a.rating;

        case "new":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "popular":
        default:
          return (
            Number(b.isPopular) - Number(a.isPopular) || b.rating - a.rating
          );
      }
    });
  }, [
    products,
    search,
    categorySlug,
    brandSlugs,
    minPrice,
    maxPrice,
    inStock,
    isNew,
    isSale,
    isPopular,
    sort,
  ]);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <Loader text="Загружаем товары..." />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className="container">
          <ErrorState
            title="Не удалось загрузить каталог"
            onRetry={() => refetch()}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>{pageTitle}</h1>

            <p>
              Найдено товаров: <strong>{filteredProducts.length}</strong>
            </p>
          </div>

          <label className={styles.sort}>
            <span>Сортировка</span>

            <select
              value={sort}
              onChange={(event) => updateParam("sort", event.target.value)}
            >
              <option value="popular">Популярные</option>

              <option value="price-asc">Сначала дешевле</option>

              <option value="price-desc">Сначала дороже</option>

              <option value="rating">По рейтингу</option>

              <option value="new">Новинки</option>
            </select>
          </label>
        </div>

        {search && (
          <div className={styles.searchResult}>
            <span>Результаты поиска:</span>

            <strong>«{search}»</strong>

            <button
              type="button"
              onClick={() => updateParam("search", undefined)}
            >
              Очистить
            </button>
          </div>
        )}

        <div
          className={isSpecialCatalog ? styles.specialLayout : styles.layout}
        >
          {!isSpecialCatalog && (
            <ProductFilters
              categorySlug={categorySlug}
              brandSlugs={brandSlugs}
              minPrice={minPrice}
              maxPrice={maxPrice}
              inStock={inStock}
              isNew={isNew}
              isSale={isSale}
              onCategoryChange={(value) => updateParam("category", value)}
              onBrandChange={handleBrandChange}
              onMinPriceChange={(value) => updateParam("minPrice", value)}
              onMaxPriceChange={(value) => updateParam("maxPrice", value)}
              onInStockChange={(value) => updateParam("inStock", value)}
              onNewChange={(value) => updateParam("isNew", value)}
              onSaleChange={(value) => updateParam("isSale", value)}
              onReset={handleReset}
            />
          )}

          <section className={styles.catalog}>
            {filteredProducts.length > 0 ? (
              <div
                className={isSpecialCatalog ? styles.specialGrid : styles.grid}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <h2>
                  {isNew
                    ? "Новых товаров пока нет"
                    : isSale
                      ? "Акционных товаров пока нет"
                      : isPopular
                        ? "Популярных товаров пока нет"
                        : "Ничего не найдено"}
                </h2>

                <p>
                  {isSpecialCatalog
                    ? "Следите за обновлениями каталога."
                    : "Попробуйте изменить параметры фильтрации."}
                </p>

                {!isSpecialCatalog && (
                  <button type="button" onClick={handleReset}>
                    Сбросить фильтры
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
