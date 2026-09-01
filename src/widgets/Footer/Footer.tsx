import { ArrowRight, Mail, MapPin, Phone, Send, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/constants/routes";
import logo from "@/shared/assets/fasonmoshin-logo.png";

import styles from "./Footer.module.scss";

const SHOP_LINKS = [
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

const CATEGORY_LINKS = [
  {
    label: "Электроника",
    to: `${ROUTES.catalog}?category=electronics`,
  },
  {
    label: "Держатели",
    to: `${ROUTES.catalog}?category=holders`,
  },
  {
    label: "Уход за автомобилем",
    to: `${ROUTES.catalog}?category=car-care`,
  },
  {
    label: "Органайзеры",
    to: `${ROUTES.catalog}?category=organizers`,
  },
  {
    label: "Коврики",
    to: `${ROUTES.catalog}?category=floor-mats`,
  },
];

const CUSTOMER_LINKS = [
  {
    label: "Доставка и оплата",
    to: ROUTES.delivery,
  },
  {
    label: "Контакты",
    to: ROUTES.contacts,
  },
  {
    label: "Избранное",
    to: ROUTES.favorites,
  },
  {
    label: "Корзина",
    to: ROUTES.cart,
  },
  {
    label: "Личный кабинет",
    to: ROUTES.profile,
  },
];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to={ROUTES.home} className={styles.logo}>
              <img className={styles.logoMark} src={logo} alt="" />

              <span className={styles.logoText}>
                Fason<span>Moshin</span>
              </span>
            </Link>

            <p className={styles.description}>
              Автоаксессуары, электроника и товары для ухода за автомобилем. Всё
              для комфорта, стиля и удобства в дороге.
            </p>

            <div className={styles.socials}>
              <a href="#" aria-label="Instagram">
                <Share2 size={18} />
              </a>

              <a href="#" aria-label="Facebook">
                <Share2 size={18} />
              </a>

              <a href="#" aria-label="Telegram">
                <Send size={18} />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3>Магазин</h3>

            <div className={styles.links}>
              {SHOP_LINKS.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <h3>Категории</h3>

            <div className={styles.links}>
              {CATEGORY_LINKS.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <h3>Покупателям</h3>

            <div className={styles.links}>
              {CUSTOMER_LINKS.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.contactColumn}>
            <h3>Контакты</h3>

            <div className={styles.contacts}>
              <a href="tel:+992000000000">
                <Phone size={17} />

                <div>
                  <span>Телефон</span>
                  <strong>+992 00 000 00 00</strong>
                </div>
              </a>

              <a href="mailto:info@fasonmoshin.tj">
                <Mail size={17} />

                <div>
                  <span>Email</span>
                  <strong>info@fasonmoshin.tj</strong>
                </div>
              </a>

              <div className={styles.contactItem}>
                <MapPin size={17} />

                <div>
                  <span>Адрес</span>
                  <strong>Душанбе, Таджикистан</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.newsletter}>
          <div>
            <span className={styles.newsletterLabel}>FASONMOSHIN CLUB</span>

            <h2>Будьте в курсе новинок и акций</h2>

            <p>
              Получайте лучшие предложения, новые товары и специальные скидки.
            </p>
          </div>

          <form
            className={styles.newsletterForm}
            onSubmit={(event) => event.preventDefault()}
          >
            <Mail size={18} className={styles.mailIcon} />

            <input type="email" placeholder="Ваш email" aria-label="Email" />

            <button type="submit">
              Подписаться
              <ArrowRight size={17} />
            </button>
          </form>
        </div>

        <div className={styles.bottom}>
          <span>© 2026 FasonMoshin. Все права защищены.</span>

          <div>
            <Link to="/privacy">Политика конфиденциальности</Link>

            <Link to="/terms">Пользовательское соглашение</Link>
          </div>

          <span>Сделано для тех, кто любит авто</span>
        </div>
      </div>
    </footer>
  );
};
