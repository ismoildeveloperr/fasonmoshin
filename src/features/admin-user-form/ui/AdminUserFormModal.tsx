import { Mail, Phone, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { useUpdateUserMutation } from "@/entities/user";

import type { User, UserRole } from "@/entities/user";

import styles from "./AdminUserFormModal.module.scss";

type AdminUserFormModalProps = {
  user: User;
  onClose: () => void;
};

export const AdminUserFormModal = ({
  user,
  onClose,
}: AdminUserFormModalProps) => {
  const updateUser = useUpdateUserMutation();

  const [name, setName] = useState(user.name);

  const [email, setEmail] = useState(user.email);

  const [phone, setPhone] = useState(user.phone);

  const [role, setRole] = useState<UserRole>(user.role);

  const [error, setError] = useState("");

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Имя и email обязательны.");

      return;
    }

    try {
      await updateUser.mutateAsync({
        id: user.id,

        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role,
        },
      });

      onClose();
    } catch {
      setError("Не удалось обновить пользователя.");
    }
  };

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
            <span>Пользователь #{user.id}</span>

            <h2>Редактировать пользователя</h2>
          </div>

          <button type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionTitle}>
            <UserRound size={19} />

            <div>
              <strong>Основная информация</strong>

              <span>Данные аккаунта пользователя</span>
            </div>
          </div>

          <div className={styles.grid}>
            <label className={styles.full}>
              <span>Имя *</span>

              <div className={styles.input}>
                <UserRound size={17} />

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              <span>Email *</span>

              <div className={styles.input}>
                <Mail size={17} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              <span>Телефон</span>

              <div className={styles.input}>
                <Phone size={17} />

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </label>

            <label className={styles.full}>
              <span>Роль</span>

              <div className={styles.input}>
                <ShieldCheck size={17} />

                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                >
                  <option value="user">Пользователь</option>

                  <option value="admin">Администратор</option>
                </select>
              </div>
            </label>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Отмена
            </button>

            <button
              type="submit"
              className={styles.submit}
              disabled={updateUser.isPending}
            >
              {updateUser.isPending ? "Сохраняем..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
