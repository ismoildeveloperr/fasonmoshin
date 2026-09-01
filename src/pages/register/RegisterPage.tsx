import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { getAuthUser, register, saveAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";

import styles from "./RegisterPage.module.scss";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = getAuthUser();

  if (currentUser) {
    return <Navigate to={ROUTES.profile} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");

      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");

      return;
    }

    setIsLoading(true);

    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      saveAuthUser(user);

      navigate(ROUTES.profile);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Не удалось зарегистрироваться");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.visual}>
          <div>
            <span>JOIN FASONMOSHIN</span>

            <h1>
              Новый
              <br />
              аккаунт
            </h1>

            <p>
              Создайте аккаунт и сохраняйте избранные товары, оформляйте заказы
              и управляйте профилем.
            </p>
          </div>

          <strong>START YOUR DRIVE.</strong>
        </section>

        <section className={styles.content}>
          <div className={styles.formContainer}>
            <span className={styles.eyebrow}>РЕГИСТРАЦИЯ</span>

            <h2>Создать аккаунт</h2>

            <p className={styles.subtitle}>Заполните данные для регистрации.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                <span>Имя</span>

                <div className={styles.input}>
                  <UserRound size={18} />

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
                  <Mail size={18} />

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
                  <Phone size={18} />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+992"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Пароль</span>

                <div className={styles.input}>
                  <LockKeyhole size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Минимум 6 символов"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <label>
                <span>Повторите пароль</span>

                <div className={styles.input}>
                  <LockKeyhole size={18} />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Повторите пароль"
                    required
                  />
                </div>
              </label>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                className={styles.submit}
                disabled={isLoading}
              >
                {isLoading ? "Создаём аккаунт..." : "Зарегистрироваться"}

                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className={styles.bottom}>
              <span>Уже есть аккаунт?</span>

              <Link to="/login">Войти</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
