import { Edit3, Package, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { useCategoriesQuery } from "@/entities/category";
import { useDeleteProductMutation, useProductsQuery } from "@/entities/product";

import type { Product } from "@/entities/product";

import { AdminProductFormModal } from "@/features/admin-product-form";
import { AdminLayout } from "@/widgets/AdminLayout";

import styles from "./AdminProductsPage.module.scss";
import { getPublicImageUrl } from "@/shared/lib";

export const AdminProductsPage = () => {
  const { data: products = [], isLoading, isError } = useProductsQuery();

  const { data: categories = [] } = useCategoriesQuery();

  const deleteProduct = useDeleteProductMutation();

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.article.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        !selectedCategory || product.categorySlug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleDelete = async (product: Product) => {
    const accepted = window.confirm(`Удалить товар "${product.name}"?`);

    if (!accepted) {
      return;
    }

    try {
      await deleteProduct.mutateAsync(product.id);
    } catch {
      window.alert("Не удалось удалить товар.");
    }
  };

  const getCategoryName = (slug: string) => {
    return categories.find((category) => category.slug === slug)?.name ?? slug;
  };

  return (
    <AdminLayout
      title="Товары"
      description="Управление каталогом товаров магазина."
    >
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.search}>
            <Search size={17} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по товару или артикулу..."
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">Все категории</option>

            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={17} />
          Добавить товар
        </button>
      </div>

      <div className={styles.summary}>
        <span>Всего товаров</span>

        <strong>{products.length}</strong>

        <small>Показано: {filteredProducts.length}</small>
      </div>

      {isLoading && <div className={styles.state}>Загружаем товары...</div>}

      {isError && (
        <div className={`${styles.state} ${styles.error}`}>
          Не удалось загрузить товары.
        </div>
      )}

      {!isLoading && !isError && filteredProducts.length === 0 && (
        <div className={styles.empty}>
          <div>
            <Package size={30} />
          </div>

          <h2>Товары не найдены</h2>

          <p>Измените параметры поиска или добавьте новый товар.</p>
        </div>
      )}

      {!isLoading && filteredProducts.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Товар</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Остаток</th>
                <th>Статусы</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.product}>
                      <div className={styles.image}>
                        {product.images?.[0] ? (
                          <img
                            src={getPublicImageUrl(product.images?.[0])}
                            alt={product.name}
                          />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>

                      <div>
                        <strong>{product.name}</strong>

                        <span>{product.article}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={styles.category}>
                      {getCategoryName(product.categorySlug)}
                    </span>
                  </td>

                  <td>
                    <div className={styles.price}>
                      <strong>{product.price} TJS</strong>

                      {product.oldPrice && product.oldPrice > product.price && (
                        <del>{product.oldPrice} TJS</del>
                      )}
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        product.stock > 0 ? styles.stock : styles.noStock
                      }
                    >
                      {product.stock > 0 ? `${product.stock} шт.` : "Нет"}
                    </span>
                  </td>

                  <td>
                    <div className={styles.badges}>
                      {product.isNew && <span>NEW</span>}

                      {product.isSale && <span>SALE</span>}

                      {product.isPopular && <span>TOP</span>}
                    </div>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        aria-label="Редактировать"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        className={styles.delete}
                        onClick={() => handleDelete(product)}
                        aria-label="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateModalOpen && (
        <AdminProductFormModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {editingProduct && (
        <AdminProductFormModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </AdminLayout>
  );
};
