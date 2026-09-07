import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ProductCard, useProductsQuery } from "@/entities/product";
import { ROUTES } from "@/shared/constants/routes";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Loader } from "@/shared/ui/Loader";

import styles from "./HomePage.module.scss";

const BENEFITS = [
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Доставим ваш заказ быстро и аккуратно",
  },
  {
    icon: BadgeCheck,
    title: "Проверенные товары",
    description: "Подбираем качественные автоаксессуары",
  },
  {
    icon: ShieldCheck,
    title: "Надёжная покупка",
    description: "Прозрачные условия и удобный сервис",
  },
  {
    icon: PackageCheck,
    title: "Товары в наличии",
    description: "Актуальные остатки и быстрое оформление заказа",
  },
];

export const HomePage = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProductsQuery();

  const popularProducts = products
    .filter((product) => product.isPopular)
    .slice(0, 4);

  const newProducts = products.filter((product) => product.isNew).slice(0, 4);

  const saleProducts = products.filter((product) => product.isSale).slice(0, 4);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <Loader text="Загружаем товары..." />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className="container">
          <ErrorState
            title="Не удалось загрузить главную страницу"
            onRetry={() => refetch()}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Sparkles size={16} />
              Всё для вашего автомобиля
            </div>

            <h1>
              Сделайте свой автомобиль
              <span> удобнее и стильнее</span>
            </h1>

            <p>
              Автоаксессуары, электроника и товары для ухода — всё необходимое в
              одном месте.
            </p>

            <div className={styles.heroActions}>
              <Link to={ROUTES.catalog} className={styles.primaryButton}>
                Смотреть каталог
                <ArrowRight size={18} />
              </Link>

              <Link
                to={`${ROUTES.catalog}?isSale=true`}
                className={styles.secondaryButton}
              >
                Смотреть акции
              </Link>
            </div>

            <div className={styles.heroMeta}>
              <div>
                <strong>500+</strong>
                <span>товаров</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>заказы онлайн</span>
              </div>

              <div>
                <strong>4.9</strong>
                <span>рейтинг магазина</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroGlow} />

            <div className={styles.heroCard}>
              <span className={styles.heroCardLabel}>FASONMOSHIN</span>

              <h2>
                ВСЁ
                <br />
                ДЛЯ АВТО
              </h2>

              <p>Премиальные автоаксессуары</p>

              <div className={styles.heroCardBottom}>
                <span>2026</span>

                <span>ЕЗДИ СТИЛЬНО</span>
              </div>
            </div>

            <div className={styles.floatingCard}>
              <Clock3 size={18} />

              <div>
                <strong>Быстро</strong>
                <span>Оформление за пару минут</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.categories}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Категории</span>

              <h2>Найдите то, что нужно</h2>
            </div>

            <Link to={ROUTES.catalog}>
              Все категории
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className={styles.categoryGrid}>
            <Link
              to={`${ROUTES.catalog}?category=electronics`}
              className={styles.categoryCard}
            >
              <span>01</span>
              <h3>Электроника</h3>
              <p>Зарядки, камеры, устройства</p>
            </Link>

            <Link
              to={`${ROUTES.catalog}?category=holders`}
              className={styles.categoryCard}
            >
              <span>02</span>
              <h3>Держатели</h3>
              <p>Для телефона и навигации</p>
            </Link>

            <Link
              to={`${ROUTES.catalog}?category=car-care`}
              className={styles.categoryCard}
            >
              <span>03</span>
              <h3>Уход за авто</h3>
              <p>Чистота и комфорт салона</p>
            </Link>

            <Link
              to={`${ROUTES.catalog}?category=organizers`}
              className={styles.categoryCard}
            >
              <span>04</span>
              <h3>Органайзеры</h3>
              <p>Порядок в салоне и багажнике</p>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Популярное</span>

              <h2>Хиты продаж</h2>
            </div>

            <Link to={`${ROUTES.catalog}?isPopular=true`}>
              Смотреть все
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.promo}>
        <div className={`container ${styles.promoContainer}`}>
          <div className={styles.promoContent}>
            <span>СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</span>

            <h2>
              Выгодные предложения
              <br />
              на автоаксессуары
            </h2>

            <p>
              Подборка товаров со специальными ценами. Предложение ограничено.
            </p>

            <Link to={`${ROUTES.catalog}?isSale=true`}>
              Смотреть акции
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.promoDecor}>
            <span>АКЦИЯ</span>

            <strong>
              ДО
              <br />
              25%
            </strong>
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Только поступили</span>

              <h2>Новинки</h2>
            </div>

            <Link to={`${ROUTES.catalog}?isNew=true`}>
              Все новинки
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Выгодно</span>

              <h2>Товары по акции</h2>
            </div>

            <Link to={`${ROUTES.catalog}?isSale=true`}>
              Все акции
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>FasonMoshin</span>

              <h2>Покупать у нас удобно</h2>
            </div>
          </div>

          <div className={styles.benefitsGrid}>
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article key={benefit.title} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>
                    <Icon size={22} />
                  </div>

                  <h3>{benefit.title}</h3>

                  <p>{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
