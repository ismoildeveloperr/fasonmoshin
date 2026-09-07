import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";

import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  UserRound,
  X,
} from "lucide-react";

import { Link, NavLink } from "react-router-dom";

import { useCartQuery } from "@/entities/cart";
import { useFavoritesQuery } from "@/entities/favorite";

import { getAuthUser } from "@/features/auth";

import { ROUTES } from "@/shared/constants/routes";

import styles from "./Header.module.scss";

export const Header = () => {
  const currentUser = getAuthUser();

  const { data: favorites = [] } = useFavoritesQuery();
  const { data: cart = [] } = useCartQuery();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("fasonmoshin-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fasonmoshin-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const favoritesCount = useMemo(() => {
    if (!currentUser) {
      return 0;
    }

    return favorites.filter(
      (item) => String(item.userId) === String(currentUser.id),
    ).length;
  }, [favorites, currentUser]);

  const cartCount = useMemo(() => {
    if (!currentUser) {
      return 0;
    }

    return cart
      .filter((item) => String(item.userId) === String(currentUser.id))
      .reduce((total, item) => total + Number(item.quantity || 1), 0);
  }, [cart, currentUser]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const profileRoute = currentUser
    ? currentUser.role === "admin"
      ? ROUTES.admin
      : ROUTES.profile
    : ROUTES.login;

  const profileLabel = currentUser
    ? currentUser.role === "admin"
      ? "Admin"
      : currentUser.name
    : "Войти";

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className="container">
            <div className={styles.topBarContent}>
              <span>Автоаксессуары для вашего автомобиля</span>

              <div>
                <Link to={ROUTES.delivery}>Доставка</Link>
                <Link to={ROUTES.contacts}>Контакты</Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainHeader}>
          <div className="container">
            <div className={styles.mainHeaderContent}>
              <Link to={ROUTES.home} className={styles.logo}>
                <div className={styles.logoImage}>
                  <img
                    src={`${import.meta.env.BASE_URL}logo.png`}
                    alt="FasonMoshin"
                  />
                </div>

                <strong>FasonMoshin</strong>
              </Link>

              <div className={styles.search}>
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Поиск по товарам, брендам, категориям..."
                />

                <button type="button">Найти</button>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.themeToggle}
                  onClick={toggleTheme}
                  aria-label="Сменить тему"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <Link to={ROUTES.favorites} className={styles.action}>
                  <div className={styles.actionIcon}>
                    <Heart size={20} />

                    {favoritesCount > 0 && (
                      <span className={styles.counter}>{favoritesCount}</span>
                    )}
                  </div>

                  <span>Избранное</span>
                </Link>

                <Link to={ROUTES.cart} className={styles.action}>
                  <div className={styles.actionIcon}>
                    <ShoppingCart size={20} />

                    {cartCount > 0 && (
                      <span className={styles.counter}>{cartCount}</span>
                    )}
                  </div>

                  <span>Корзина</span>
                </Link>

                <Link to={profileRoute} className={styles.action}>
                  <UserRound size={20} />

                  <span>{profileLabel}</span>
                </Link>
              </div>

              <button
                type="button"
                className={styles.mobileMenuButton}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Открыть меню"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        <nav className={styles.navigation}>
          <div className="container">
            <div className={styles.navigationContent}>
              <NavLink to={ROUTES.home}>Главная</NavLink>
              <NavLink to={ROUTES.catalog}>Каталог</NavLink>
              <NavLink to="/catalog?isNew=true">Новинки</NavLink>
              <NavLink to="/catalog?isSale=true">Акции</NavLink>
              <NavLink to="/catalog?isPopular=true">Популярные</NavLink>

              <span className={styles.separator} />

              <NavLink to={ROUTES.delivery}>Доставка и оплата</NavLink>
            </div>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen &&
        createPortal(
          <>
            <button
              type="button"
              className={styles.mobileOverlay}
              onClick={closeMobileMenu}
              aria-label="Закрыть меню"
            />

            <aside className={styles.mobileMenu}>
              <div className={styles.mobileMenuHeader}>
                <Link
                  to={ROUTES.home}
                  className={styles.mobileBrand}
                  onClick={closeMobileMenu}
                >
                  <div className={styles.mobileBrandLogo}>
                    <img
                      src={`${import.meta.env.BASE_URL}logo.png`}
                      alt="FasonMoshin"
                    />
                  </div>

                  <div className={styles.mobileBrandText}>
                    <strong>FasonMoshin</strong>
                    <span>Автоаксессуары</span>
                  </div>
                </Link>

                <button
                  type="button"
                  className={styles.mobileMenuClose}
                  onClick={closeMobileMenu}
                  aria-label="Закрыть меню"
                >
                  <X size={21} />
                </button>
              </div>

              <div className={styles.mobileMenuBody}>
                <div className={styles.mobileSectionLabel}>Навигация</div>

                <nav className={styles.mobileNavigation}>
                  <NavLink
                    to={ROUTES.home}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `${styles.mobileMenuLink} ${
                        isActive ? styles.mobileMenuLinkActive : ""
                      }`
                    }
                  >
                    Главная
                  </NavLink>

                  <NavLink
                    to={ROUTES.catalog}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `${styles.mobileMenuLink} ${
                        isActive ? styles.mobileMenuLinkActive : ""
                      }`
                    }
                  >
                    Каталог
                  </NavLink>

                  <NavLink
                    to="/catalog?isNew=true"
                    onClick={closeMobileMenu}
                    className={styles.mobileMenuLink}
                  >
                    Новинки
                  </NavLink>

                  <NavLink
                    to="/catalog?isSale=true"
                    onClick={closeMobileMenu}
                    className={styles.mobileMenuLink}
                  >
                    Акции
                  </NavLink>

                  <NavLink
                    to="/catalog?isPopular=true"
                    onClick={closeMobileMenu}
                    className={styles.mobileMenuLink}
                  >
                    Популярные
                  </NavLink>

                  <NavLink
                    to={ROUTES.delivery}
                    onClick={closeMobileMenu}
                    className={styles.mobileMenuLink}
                  >
                    Доставка и оплата
                  </NavLink>

                  <NavLink
                    to={ROUTES.contacts}
                    onClick={closeMobileMenu}
                    className={styles.mobileMenuLink}
                  >
                    Контакты
                  </NavLink>
                </nav>

                <div className={styles.mobileDivider} />

                <div className={styles.mobileSectionLabel}>Аккаунт</div>

                <div className={styles.mobileMenuActions}>
                  <button
                    type="button"
                    className={styles.mobileAction}
                    onClick={toggleTheme}
                  >
                    <div className={styles.mobileActionIcon}>
                      {theme === "dark" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                    </div>

                    <span>
                      {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                    </span>
                  </button>

                  <Link
                    to={ROUTES.favorites}
                    className={styles.mobileAction}
                    onClick={closeMobileMenu}
                  >
                    <div className={styles.mobileActionIcon}>
                      <Heart size={18} />
                    </div>

                    <span>Избранное</span>

                    {favoritesCount > 0 && (
                      <strong className={styles.mobileCount}>
                        {favoritesCount}
                      </strong>
                    )}
                  </Link>

                  <Link
                    to={ROUTES.cart}
                    className={styles.mobileAction}
                    onClick={closeMobileMenu}
                  >
                    <div className={styles.mobileActionIcon}>
                      <ShoppingCart size={18} />
                    </div>

                    <span>Корзина</span>

                    {cartCount > 0 && (
                      <strong className={styles.mobileCount}>
                        {cartCount}
                      </strong>
                    )}
                  </Link>

                  <Link
                    to={profileRoute}
                    className={styles.mobileAction}
                    onClick={closeMobileMenu}
                  >
                    <div className={styles.mobileActionIcon}>
                      <UserRound size={18} />
                    </div>

                    <span>
                      {currentUser?.role === "admin"
                        ? "Админ-панель"
                        : currentUser
                          ? "Профиль"
                          : "Войти"}
                    </span>
                  </Link>
                </div>
              </div>

              <div className={styles.mobileMenuFooter}>
                <strong>FasonMoshin</strong>
                <span>Всё для вашего автомобиля</span>
              </div>
            </aside>
          </>,
          document.body,
        )}
    </>
  );
};
