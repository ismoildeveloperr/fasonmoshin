import { Edit3, Plus, Search, Tags, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { useBrandsQuery, useDeleteBrandMutation } from "@/entities/brand";

import type { Brand } from "@/entities/brand";

import { AdminBrandFormModal } from "@/features/admin-brand-form";
import { AdminLayout } from "@/widgets/AdminLayout";

import styles from "./AdminBrandsPage.module.scss";

export const AdminBrandsPage = () => {
  const { data: brands = [], isLoading, isError } = useBrandsQuery();

  const deleteBrand = useDeleteBrandMutation();

  const [search, setSearch] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return brands;
    }

    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.slug.toLowerCase().includes(query),
    );
  }, [brands, search]);

  const handleDelete = async (brand: Brand) => {
    const accepted = window.confirm(`Удалить бренд "${brand.name}"?`);

    if (!accepted) {
      return;
    }

    try {
      await deleteBrand.mutateAsync(brand.id);
    } catch {
      window.alert("Не удалось удалить бренд.");
    }
  };

  return (
    <AdminLayout title="Бренды" description="Управление брендами товаров.">
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={17} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск бренда..."
          />
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={17} />
          Добавить бренд
        </button>
      </div>

      <div className={styles.summary}>
        <span>Всего брендов</span>

        <strong>{brands.length}</strong>

        <small>Показано: {filteredBrands.length}</small>
      </div>

      {isLoading && <div className={styles.state}>Загружаем бренды...</div>}

      {isError && (
        <div className={`${styles.state} ${styles.error}`}>
          Не удалось загрузить бренды.
        </div>
      )}

      {!isLoading && !isError && filteredBrands.length === 0 && (
        <div className={styles.empty}>
          <div>
            <Tags size={30} />
          </div>

          <h2>Бренды не найдены</h2>

          <p>Добавьте первый бренд.</p>
        </div>
      )}

      {!isLoading && filteredBrands.length > 0 && (
        <div className={styles.grid}>
          {filteredBrands.map((brand) => (
            <article key={brand.id} className={styles.card}>
              <div className={styles.logo}>
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} />
                ) : (
                  <Tags size={30} />
                )}
              </div>

              <div className={styles.content}>
                <div className={styles.cardTop}>
                  <div>
                    <strong>{brand.name}</strong>

                    <span>{brand.slug}</span>
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => setEditingBrand(brand)}
                      aria-label="Редактировать"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      className={styles.delete}
                      onClick={() => handleDelete(brand)}
                      aria-label="Удалить"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <AdminBrandFormModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {editingBrand && (
        <AdminBrandFormModal
          brand={editingBrand}
          onClose={() => setEditingBrand(null)}
        />
      )}
    </AdminLayout>
  );
};
