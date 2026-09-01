import { Bell, Check, Mail, Phone, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { User } from "@/entities/user";
import { getAuthUser, saveAuthUser } from "@/features/auth";
import { API_ENDPOINTS, apiClient } from "@/shared/api";
import { ProfileLayout } from "@/widgets/ProfileLayout";

import styles from "./SettingsPage.module.scss";

export const SettingsPage = () => {
  const currentUser = getAuthUser();

  const [name, setName] = useState(currentUser?.name ?? "");

  const [email, setEmail] = useState(currentUser?.email ?? "");

  const [phone, setPhone] = useState(currentUser?.phone ?? "");

  const [emailNotifications, setEmailNotifications] = useState(
    currentUser?.emailNotifications ?? true,
  );

  const [orderNotifications, setOrderNotifications] = useState(
    currentUser?.orderNotifications ?? true,
  );

  const [isSaving, setIsSaving] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  const [error, setError] = useState("");

  if (!currentUser) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setIsSaved(false);
    setError("");

    try {
      const { data } = await apiClient.patch<User>(
        `${API_ENDPOINTS.users}/${currentUser.id}`,
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          emailNotifications,
          orderNotifications,
        },
      );

      saveAuthUser(data);

      setIsSaved(true);

      window.setTimeout(() => {
        setIsSaved(false);
      }, 2500);
    } catch {
      setError("Не удалось сохранить настройки.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProfileLayout
      title="Настройки"
      description="Управляйте личными данными и уведомлениями."
    >
      <form className={styles.content} onSubmit={handleSubmit}>
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <UserRound size={21} />
            </div>

            <div>
              <span>Аккаунт</span>

              <h2>Личные данные</h2>

              <p>
                Эти данные используются для вашего аккаунта и оформления
                заказов.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label>
              <span>Имя</span>

              <div className={styles.input}>
                <UserRound size={17} />

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ваше имя"
                  required
                />
              </div>
            </label>

            <label>
              <span>Email</span>

              <div className={styles.input}>
                <Mail size={17} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@mail.com"
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
                  placeholder="+992"
                />
              </div>
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Bell size={21} />
            </div>

            <div>
              <span>Уведомления</span>

              <h2>Настройки уведомлений</h2>

              <p>Выберите, какие уведомления хотите получать.</p>
            </div>
          </div>

          <div className={styles.settingsList}>
            <label className={styles.settingItem}>
              <div>
                <strong>Email-уведомления</strong>

                <span>Новости, акции и специальные предложения.</span>
              </div>

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(event) =>
                  setEmailNotifications(event.target.checked)
                }
              />
            </label>

            <label className={styles.settingItem}>
              <div>
                <strong>Статус заказа</strong>

                <span>Получать уведомления об изменении состояния заказа.</span>
              </div>

              <input
                type="checkbox"
                checked={orderNotifications}
                onChange={(event) =>
                  setOrderNotifications(event.target.checked)
                }
              />
            </label>
          </div>
        </section>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          {isSaved && (
            <span className={styles.success}>
              <Check size={16} />
              Изменения сохранены
            </span>
          )}

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Сохраняем..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </ProfileLayout>
  );
};
