import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { useState, type FormEvent } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { getAuthUser, login, saveAuthUser } from "@/features/auth";

import { ROUTES } from "@/shared/constants/routes";

import styles from "./LoginPage.module.scss";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const currentUser = getAuthUser();

  /**
   * Если пользователь уже авторизован,
   * отправляем его на страницу по роли.
   */
  if (currentUser) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? ROUTES.admin : ROUTES.profile}
        replace
      />
    );
  }

  /**
   * Авторизация пользователя.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const user = await login({
        email: email.trim(),
        password,
      });

      /**
       * Сохраняем авторизованного пользователя.
       */
      saveAuthUser(user);

      /**
       * Администратор сразу переходит
       * в админ-панель.
       */
      if (user.role === "admin") {
        navigate(ROUTES.admin, {
          replace: true,
        });

        return;
      }

      /**
       * Обычный пользователь переходит
       * в личный кабинет.
       */
      navigate(ROUTES.profile, {
        replace: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Не удалось выполнить вход");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        {/* Левая визуальная часть */}
        <section className={styles.visual}>
          <div>
            <span>FASONMOSHIN</span>

            <h1>
              Добро
              <br />
              пожаловать
            </h1>

            <p>
              Войдите в аккаунт, чтобы управлять заказами, избранным и личными
              данными.
            </p>
          </div>

          <strong>ЕЗДИ СТИЛЬНО.</strong>
        </section>

        {/* Форма авторизации */}
        <section className={styles.content}>
          <div className={styles.formContainer}>
            <span className={styles.eyebrow}>ЛИЧНЫЙ КАБИНЕТ</span>

            <h2>Войти</h2>

            <p className={styles.subtitle}>Введите данные вашего аккаунта.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Email */}
              <label>
                <span>Email</span>

                <div className={styles.input}>
                  <Mail size={18} />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@mail.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              {/* Password */}
              <label>
                <span>Пароль</span>

                <div className={styles.input}>
                  <LockKeyhole size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Введите пароль"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {/* Error */}
              {error && <div className={styles.error}>{error}</div>}

              {/* Submit */}
              <button
                type="submit"
                className={styles.submit}
                disabled={isLoading}
              >
                {isLoading ? "Входим..." : "Войти"}

                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className={styles.bottom}>
              <span>Нет аккаунта?</span>

              <Link to={ROUTES.register}>Зарегистрироваться</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
