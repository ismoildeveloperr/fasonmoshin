import { Image, Layers, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/entities/category";

import type { Category } from "@/entities/category";

import styles from "./AdminCategoryFormModal.module.scss";

type AdminCategoryFormModalProps = {
  category?: Category | null;
  onClose: () => void;
};

export const AdminCategoryFormModal = ({
  category,
  onClose,
}: AdminCategoryFormModalProps) => {
  const isEditing = Boolean(category);

  const { data: categories = [] } = useCategoriesQuery();

  const createCategory = useCreateCategoryMutation();

  const updateCategory = useUpdateCategoryMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) {
      return;
    }

    setName(category.name);
    setSlug(category.slug);
    setImage(category.image ?? "");

    setParentId(category.parentId ? String(category.parentId) : "");
  }, [category]);

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

    if (!name.trim() || !slug.trim()) {
      setError("Название и slug обязательны.");

      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      image: image.trim() || undefined,
      parentId: parentId || null,
    };

    try {
      if (category) {
        await updateCategory.mutateAsync({
          id: category.id,
          data: payload,
        });
      } else {
        await createCategory.mutateAsync(payload);
      }

      onClose();
    } catch {
      setError("Не удалось сохранить категорию.");
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  const availableParents = categories.filter(
    (item) => String(item.id) !== String(category?.id),
  );

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
            <span>{isEditing ? "Редактирование" : "Новая категория"}</span>

            <h2>
              {isEditing ? "Редактировать категорию" : "Добавить категорию"}
            </h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionTitle}>
            <Layers size={19} />

            <div>
              <strong>Основная информация</strong>

              <span>Название и slug категории</span>
            </div>
          </div>

          <div className={styles.grid}>
            <label>
              <span>Название *</span>

              <input
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Электроника"
                required
              />
            </label>

            <label>
              <span>Slug *</span>

              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="electronics"
                required
              />
            </label>

            <label className={styles.full}>
              <span>Родительская категория</span>

              <select
                value={parentId}
                onChange={(event) => setParentId(event.target.value)}
              >
                <option value="">Без родительской категории</option>

                {availableParents.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.full}>
              <span>URL изображения</span>

              <div className={styles.imageInput}>
                <Image size={17} />

                <input
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="https://..."
                />
              </div>
            </label>
          </div>

          {image && (
            <div className={styles.preview}>
              <img src={image} alt={name || "Категория"} />
            </div>
          )}

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
                  : "Добавить категорию"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
