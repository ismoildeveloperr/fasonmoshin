import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

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

import { useCartQuery } from "@/entities/cart";
import { useFavoritesQuery } from "@/entities/favorite";

import { getAuthUser } from "@/features/auth";

import { ROUTES } from "@/shared/constants/routes";
import logo from "@/shared/assets/fasonmoshin-logo.png";

import styles from "./Header.module.scss";

const NAVIGATION = [
  {
    label: "Главная",
    to: ROUTES.home,
  },
  {
    label: "Каталог",
    to: ROUTES.catalog,
  },
  {
    label: "Новинки",
    to: `${ROUTES.catalog}?isNew=true`,
  },
  {
    label: "Акции",
    to: `${ROUTES.catalog}?isSale=true`,
  },
  {
    label: "Популярные",
    to: `${ROUTES.catalog}?isPopular=true`,
  },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

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

  const currentUser = getAuthUser();

  const { data: cart = [] } = useCartQuery();

  const { data: favorites = [] } = useFavoritesQuery();

  const userCartItems = currentUser
    ? cart.filter((item) => String(item.userId) === String(currentUser.id))
    : [];

  const cartCount = userCartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const currentUserFavorites = currentUser
    ? favorites.filter(
        (favorite) => String(favorite.userId) === String(currentUser.id),
      )
    : [];

  const uniqueFavoriteProductIds = new Set(
    currentUserFavorites.map((favorite) => String(favorite.productId)),
  );

  const favoritesCount = uniqueFavoriteProductIds.size;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fasonmoshin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = searchValue.trim();

    if (!value) {
      navigate(ROUTES.catalog);

      return;
    }

    navigate(`${ROUTES.catalog}?search=${encodeURIComponent(value)}`);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isNavigationActive = (to: string) => {
    const [targetPathname, targetSearch = ""] = to.split("?");

    if (location.pathname !== targetPathname) {
      return false;
    }

    if (targetPathname === ROUTES.home) {
      return location.pathname === ROUTES.home;
    }

    const currentParams = new URLSearchParams(location.search);

    const targetParams = new URLSearchParams(targetSearch);

    if (targetPathname === ROUTES.catalog && !targetSearch) {
      return (
        !currentParams.has("isNew") &&
        !currentParams.has("isSale") &&
        !currentParams.has("isPopular")
      );
    }

    for (const [key, value] of targetParams.entries()) {
      if (currentParams.get(key) !== value) {
        return false;
      }
    }

    return true;
  };

  return (
    <header className={styles.header}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarContainer}`}>
          <span>Автоаксессуары для вашего автомобиля</span>

          <div className={styles.topBarLinks}>
            <Link to={ROUTES.delivery}>Доставка</Link>

            <Link to={ROUTES.contacts}>Контакты</Link>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className={styles.main}>
        <div className={`container ${styles.mainContainer}`}>
          {/* MOBILE MENU */}
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="Открыть меню"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* LOGO */}
          <Link
            to={ROUTES.home}
            className={styles.logo}
            aria-label="FasonMoshin — главная"
          >
            <img className={styles.logoIcon} src={logo} alt="" />

            <span className={styles.logoText}>
              Fason
              <span>Moshin</span>
            </span>
          </Link>

          {/* DESKTOP SEARCH */}
          <form className={styles.search} onSubmit={handleSearchSubmit}>
            <Search className={styles.searchIcon} size={20} />

            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Поиск по товарам, брендам, категориям..."
              aria-label="Поиск товаров"
            />

            <button type="submit">Найти</button>
          </form>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Включить тёмную тему"
                  : "Включить светлую тему"
              }
              title={
                theme === "light"
                  ? "Включить тёмную тему"
                  : "Включить светлую тему"
              }
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* FAVORITES */}
            <Link
              to={currentUser ? ROUTES.favorites : ROUTES.login}
              className={styles.action}
              aria-label="Избранное"
            >
              <span className={styles.actionIcon}>
                <Heart size={22} />

                {favoritesCount > 0 && (
                  <span className={styles.counter}>{favoritesCount}</span>
                )}
              </span>

              <span className={styles.actionLabel}>Избранное</span>
            </Link>

            {/* CART */}
            <Link
              to={currentUser ? ROUTES.cart : ROUTES.login}
              className={styles.action}
              aria-label="Корзина"
            >
              <span className={styles.actionIcon}>
                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className={styles.counter}>{cartCount}</span>
                )}
              </span>

              <span className={styles.actionLabel}>Корзина</span>
            </Link>

            {/* PROFILE */}
            <Link
              to={
                currentUser
                  ? currentUser.role === "admin"
                    ? ROUTES.admin
                    : ROUTES.profile
                  : ROUTES.login
              }
              className={styles.action}
              aria-label={currentUser ? "Профиль" : "Войти"}
            >
              <span className={styles.actionIcon}>
                <UserRound size={22} />
              </span>

              <span className={styles.actionLabel}>
                {currentUser ? currentUser.name : "Войти"}
              </span>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className={`container ${styles.mobileSearchContainer}`}>
          <form className={styles.search} onSubmit={handleSearchSubmit}>
            <Search className={styles.searchIcon} size={20} />

            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Найти товар..."
              aria-label="Поиск товаров"
            />

            <button type="submit">Найти</button>
          </form>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className={styles.navigation}>
        <div className={`container ${styles.navigationContainer}`}>
          {NAVIGATION.map((item) => {
            const isActive = isNavigationActive(item.to);

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`${styles.navigationLink} ${
                  isActive ? styles.active : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <span className={styles.navigationDivider} />

          <Link to={ROUTES.delivery} className={styles.navigationLink}>
            Доставка и оплата
          </Link>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay}>
          <button
            type="button"
            className={styles.mobileBackdrop}
            onClick={closeMobileMenu}
            aria-label="Закрыть меню"
          />

          <aside className={styles.mobileMenu}>
            <div className={styles.mobileMenuHeader}>
              <Link
                to={ROUTES.home}
                className={styles.logo}
                onClick={closeMobileMenu}
              >
                <img className={styles.logoIcon} src={logo} alt="" />

                <span className={styles.logoText}>
                  Fason
                  <span>Moshin</span>
                </span>
              </Link>

              <button
                type="button"
                className={styles.mobileCloseButton}
                onClick={closeMobileMenu}
                aria-label="Закрыть меню"
              >
                <X size={24} />
              </button>
            </div>

            {/* MOBILE NAVIGATION */}
            <div className={styles.mobileNav}>
              {NAVIGATION.map((item) => {
                const isActive = isNavigationActive(item.to);

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={isActive ? styles.mobileActive : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link to={ROUTES.delivery} onClick={closeMobileMenu}>
                Доставка и оплата
              </Link>

              <Link to={ROUTES.contacts} onClick={closeMobileMenu}>
                Контакты
              </Link>
            </div>

            {/* MOBILE ACTIONS */}
            <div className={styles.mobileActions}>
              <button
                type="button"
                className={styles.mobileThemeToggle}
                onClick={toggleTheme}
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                {theme === "light" ? "Тёмная тема" : "Светлая тема"}
              </button>

              <Link
                to={currentUser ? ROUTES.favorites : ROUTES.login}
                onClick={closeMobileMenu}
              >
                <Heart size={20} />
                Избранное
                {favoritesCount > 0 && <span>{favoritesCount}</span>}
              </Link>

              <Link
                to={currentUser ? ROUTES.cart : ROUTES.login}
                onClick={closeMobileMenu}
              >
                <ShoppingCart size={20} />
                Корзина
                {cartCount > 0 && <span>{cartCount}</span>}
              </Link>

              <Link
                to={
                  currentUser
                    ? currentUser.role === "admin"
                      ? ROUTES.admin
                      : ROUTES.profile
                    : ROUTES.login
                }
                onClick={closeMobileMenu}
              >
                <UserRound size={20} />

                {currentUser
                  ? currentUser.role === "admin"
                    ? "Админ-панель"
                    : currentUser.name
                  : "Войти"}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
