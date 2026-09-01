import { Image, Tags, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/entities/brand";

import type { Brand } from "@/entities/brand";

import styles from "./AdminBrandFormModal.module.scss";

type AdminBrandFormModalProps = {
  brand?: Brand | null;
  onClose: () => void;
};

export const AdminBrandFormModal = ({
  brand,
  onClose,
}: AdminBrandFormModalProps) => {
  const isEditing = Boolean(brand);

  const createBrand = useCreateBrandMutation();

  const updateBrand = useUpdateBrandMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!brand) {
      return;
    }

    setName(brand.name);
    setSlug(brand.slug);
    setLogo(brand.logo ?? "");
  }, [brand]);

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
      logo: logo.trim() || undefined,
    };

    try {
      if (brand) {
        await updateBrand.mutateAsync({
          id: brand.id,
          data: payload,
        });
      } else {
        await createBrand.mutateAsync(payload);
      }

      onClose();
    } catch {
      setError("Не удалось сохранить бренд.");
    }
  };

  const isPending = createBrand.isPending || updateBrand.isPending;

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
            <span>{isEditing ? "Редактирование" : "Новый бренд"}</span>

            <h2>{isEditing ? "Редактировать бренд" : "Добавить бренд"}</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionTitle}>
            <Tags size={19} />

            <div>
              <strong>Основная информация</strong>

              <span>Название, slug и логотип</span>
            </div>
          </div>

          <div className={styles.grid}>
            <label>
              <span>Название *</span>

              <input
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Baseus"
                required
              />
            </label>

            <label>
              <span>Slug *</span>

              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="baseus"
                required
              />
            </label>

            <label className={styles.full}>
              <span>URL логотипа</span>

              <div className={styles.imageInput}>
                <Image size={17} />

                <input
                  value={logo}
                  onChange={(event) => setLogo(event.target.value)}
                  placeholder="https://..."
                />
              </div>
            </label>
          </div>

          {logo && (
            <div className={styles.preview}>
              <img src={logo} alt={name || "Бренд"} />
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
                  : "Добавить бренд"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
