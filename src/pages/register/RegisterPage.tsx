import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { useState, type FormEvent } from "react";

import { Link, Navigate } from "react-router-dom";

import { register, useAuth } from "@/features/auth";

import { ROUTES } from "@/shared/constants/routes";

import { Loader } from "@/shared/ui/Loader";

import styles from "./RegisterPage.module.scss";

export const RegisterPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  if (isAuthLoading) {
    return <Loader text="Проверяем авторизацию..." />;
  }

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? ROUTES.admin : ROUTES.profile}
        replace
      />
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedName = name.trim();

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedPhone = phone.trim();

    if (normalizedName.length < 2) {
      setError("Введите корректное имя");

      return;
    }

    if (!normalizedEmail) {
      setError("Введите email");

      return;
    }

    if (normalizedPhone.length < 7) {
      setError("Введите корректный номер телефона");

      return;
    }

    if (password.length < 10) {
      setError("Пароль должен содержать минимум 10 символов");

      return;
    }

    const hasLetter = /[A-Za-zА-Яа-яЁё]/.test(password);

    const hasNumber = /\d/.test(password);

    if (!hasLetter || !hasNumber) {
      setError("Пароль должен содержать буквы и цифры");

      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");

      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: normalizedName,

        email: normalizedEmail,

        phone: normalizedPhone,

        password,
      });

      if (result.requiresEmailConfirmation) {
        setSuccess(
          "Аккаунт создан. Мы отправили письмо на вашу почту. Подтвердите email, затем войдите.",
        );

        setPassword("");
        setConfirmPassword("");

        return;
      }

      setSuccess("Аккаунт успешно создан.");
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

            {success ? (
              <div className={styles.successBlock}>
                <CheckCircle2 size={32} />

                <h3>Проверьте почту</h3>

                <p>{success}</p>

                <Link to={ROUTES.login} className={styles.submit}>
                  Перейти ко входу
                  <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <label>
                    <span>Имя</span>

                    <div className={styles.input}>
                      <UserRound size={18} />

                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Ваше имя"
                        autoComplete="name"
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
                        autoComplete="email"
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
                        autoComplete="tel"
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
                        placeholder="Минимум 10 символов"
                        autoComplete="new-password"
                        minLength={10}
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Скрыть пароль" : "Показать пароль"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </label>

                  <label>
                    <span>Повторите пароль</span>

                    <div className={styles.input}>
                      <LockKeyhole size={18} />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Повторите пароль"
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Скрыть пароль"
                            : "Показать пароль"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
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

                  <Link to={ROUTES.login}>Войти</Link>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
