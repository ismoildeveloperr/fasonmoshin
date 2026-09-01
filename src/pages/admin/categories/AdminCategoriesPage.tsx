import { Edit3, FolderOpen, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/entities/category";

import type { Category } from "@/entities/category";

import { AdminCategoryFormModal } from "@/features/admin-category-form";
import { AdminLayout } from "@/widgets/AdminLayout";

import styles from "./AdminCategoriesPage.module.scss";

export const AdminCategoriesPage = () => {
  const { data: categories = [], isLoading, isError } = useCategoriesQuery();

  const deleteCategory = useDeleteCategoryMutation();

  const [search, setSearch] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query),
    );
  }, [categories, search]);

  const getParentName = (parentId?: string | number | null) => {
    if (!parentId) {
      return "—";
    }

    return (
      categories.find((item) => String(item.id) === String(parentId))?.name ??
      "—"
    );
  };

  const handleDelete = async (category: Category) => {
    const hasProducts = false;

    if (hasProducts) {
      window.alert("Нельзя удалить категорию, пока в ней есть товары.");

      return;
    }

    const accepted = window.confirm(`Удалить категорию "${category.name}"?`);

    if (!accepted) {
      return;
    }

    try {
      await deleteCategory.mutateAsync(category.id);
    } catch {
      window.alert("Не удалось удалить категорию.");
    }
  };

  return (
    <AdminLayout
      title="Категории"
      description="Управление категориями каталога."
    >
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={17} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск категории..."
          />
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={17} />
          Добавить категорию
        </button>
      </div>

      <div className={styles.summary}>
        <span>Всего категорий</span>

        <strong>{categories.length}</strong>

        <small>Показано: {filteredCategories.length}</small>
      </div>

      {isLoading && <div className={styles.state}>Загружаем категории...</div>}

      {isError && (
        <div className={`${styles.state} ${styles.error}`}>
          Не удалось загрузить категории.
        </div>
      )}

      {!isLoading && !isError && filteredCategories.length === 0 && (
        <div className={styles.empty}>
          <div>
            <FolderOpen size={30} />
          </div>

          <h2>Категории не найдены</h2>

          <p>Добавьте первую категорию каталога.</p>
        </div>
      )}

      {!isLoading && filteredCategories.length > 0 && (
        <div className={styles.grid}>
          {filteredCategories.map((category) => (
            <article key={category.id} className={styles.card}>
              <div className={styles.image}>
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <FolderOpen size={30} />
                )}
              </div>

              <div className={styles.content}>
                <div className={styles.cardTop}>
                  <div>
                    <strong>{category.name}</strong>

                    <span>{category.slug}</span>
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(category)}
                      aria-label="Редактировать"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      className={styles.delete}
                      onClick={() => handleDelete(category)}
                      aria-label="Удалить"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className={styles.parent}>
                  <span>Родительская категория</span>

                  <strong>{getParentName(category.parentId)}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <AdminCategoryFormModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {editingCategory && (
        <AdminCategoryFormModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </AdminLayout>
  );
};
