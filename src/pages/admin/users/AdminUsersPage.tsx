import {
  Edit3,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useDeleteUserMutation, useUsersQuery } from "@/entities/user";

import type { User, UserRole } from "@/entities/user";

import { getAuthUser } from "@/features/auth";
import { AdminUserFormModal } from "@/features/admin-user-form";
import { AdminLayout } from "@/widgets/AdminLayout";

import styles from "./AdminUsersPage.module.scss";

export const AdminUsersPage = () => {
  const currentUser = getAuthUser();

  const { data: users = [], isLoading, isError } = useUsersQuery();

  const deleteUser = useDeleteUserMutation();

  const [search, setSearch] = useState("");

  const [role, setRole] = useState<UserRole | "">("");

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query);

      const matchesRole = !role || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const adminsCount = users.filter((user) => user.role === "admin").length;

  const normalUsersCount = users.filter((user) => user.role === "user").length;

  const handleDelete = async (user: User) => {
    if (currentUser && String(user.id) === String(currentUser.id)) {
      window.alert("Нельзя удалить свой текущий аккаунт администратора.");

      return;
    }

    const accepted = window.confirm(`Удалить пользователя "${user.name}"?`);

    if (!accepted) {
      return;
    }

    try {
      await deleteUser.mutateAsync(user.id);
    } catch {
      window.alert("Не удалось удалить пользователя.");
    }
  };

  return (
    <AdminLayout
      title="Пользователи"
      description="Управление аккаунтами и ролями пользователей."
    >
      <div className={styles.stats}>
        <article>
          <div>
            <Users size={20} />
          </div>

          <span>Всего</span>

          <strong>{users.length}</strong>
        </article>

        <article>
          <div>
            <UserRound size={20} />
          </div>

          <span>Пользователи</span>

          <strong>{normalUsersCount}</strong>
        </article>

        <article>
          <div>
            <ShieldCheck size={20} />
          </div>

          <span>Администраторы</span>

          <strong>{adminsCount}</strong>
        </article>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={17} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Имя, email или телефон..."
          />
        </div>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole | "")}
        >
          <option value="">Все роли</option>

          <option value="user">Пользователь</option>

          <option value="admin">Администратор</option>
        </select>
      </div>

      {isLoading && (
        <div className={styles.state}>Загружаем пользователей...</div>
      )}

      {isError && (
        <div className={`${styles.state} ${styles.error}`}>
          Не удалось загрузить пользователей.
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 && (
        <div className={styles.empty}>
          <div>
            <Users size={30} />
          </div>

          <h2>Пользователи не найдены</h2>

          <p>Измените параметры поиска.</p>
        </div>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Регистрация</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const isCurrentUser =
                  currentUser && String(currentUser.id) === String(user.id);

                const createdAt = new Intl.DateTimeFormat("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(user.createdAt));

                return (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.user}>
                        <div className={styles.avatar}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div className={styles.userName}>
                            <strong>{user.name}</strong>

                            {isCurrentUser && <span>Вы</span>}
                          </div>

                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>

                    <td>{user.phone || "—"}</td>

                    <td>
                      <span
                        className={`${styles.role} ${
                          user.role === "admin" ? styles.admin : styles.userRole
                        }`}
                      >
                        {user.role === "admin"
                          ? "Администратор"
                          : "Пользователь"}
                      </span>
                    </td>

                    <td>{createdAt}</td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          aria-label="Редактировать"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          className={styles.delete}
                          disabled={Boolean(isCurrentUser)}
                          onClick={() => handleDelete(user)}
                          aria-label="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <AdminUserFormModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </AdminLayout>
  );
};
