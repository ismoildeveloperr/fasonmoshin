import {
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";

import styles from "./DeliveryPage.module.scss";

const DELIVERY_METHODS = [
  {
    icon: Truck,
    title: "Курьерская доставка",
    description: "Доставим заказ по указанному адресу быстро и аккуратно.",
    meta: "от 20 TJS",
  },
  {
    icon: MapPin,
    title: "Самовывоз",
    description: "Заберите заказ самостоятельно из доступного пункта выдачи.",
    meta: "Бесплатно",
  },
  {
    icon: PackageCheck,
    title: "Доставка по регионам",
    description:
      "Отправляем заказы в другие города через доступные транспортные службы.",
    meta: "По тарифу",
  },
];

const PAYMENT_METHODS = [
  {
    icon: CreditCard,
    title: "Банковская карта",
    description: "Оплата банковской картой при оформлении заказа.",
  },
  {
    icon: Banknote,
    title: "Наличными",
    description: "Оплата наличными при получении, если способ доступен.",
  },
  {
    icon: WalletCards,
    title: "Электронная оплата",
    description: "Поддержка онлайн-оплаты через доступные платёжные сервисы.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Оформите заказ",
    description: "Добавьте товары в корзину и заполните контактные данные.",
  },
  {
    number: "02",
    title: "Выберите доставку",
    description: "Укажите удобный способ получения заказа.",
  },
  {
    number: "03",
    title: "Выберите оплату",
    description: "Оплатите заказ удобным доступным способом.",
  },
  {
    number: "04",
    title: "Получите заказ",
    description: "Мы подготовим заказ и передадим его на доставку.",
  },
];

export const DeliveryPage = () => {
  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>FASONMOSHIN SERVICE</span>

            <h1>
              Доставка
              <span> и оплата</span>
            </h1>

            <p>
              Выберите удобный способ получения и оплаты заказа. Мы стараемся
              сделать процесс покупки максимально простым и понятным.
            </p>

            <div className={styles.heroStats}>
              <div>
                <Truck size={20} />
                <span>
                  <strong>Быстро</strong>
                  Доставка без лишних ожиданий
                </span>
              </div>

              <div>
                <ShieldCheck size={20} />
                <span>
                  <strong>Надёжно</strong>
                  Бережная обработка заказа
                </span>
              </div>

              <div>
                <Clock3 size={20} />
                <span>
                  <strong>Удобно</strong>
                  Несколько способов получения
                </span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualBadge}>DELIVERY</div>

            <div className={styles.visualCard}>
              <Truck size={42} />

              <span>YOUR ORDER</span>

              <strong>
                ON
                <br />
                THE WAY
              </strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Получение заказа</span>
            <h2>Способы доставки</h2>
          </div>

          <div className={styles.cardsGrid}>
            {DELIVERY_METHODS.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className={styles.methodCard}>
                  <div className={styles.icon}>
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <span className={styles.meta}>{item.meta}</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.darkSection}>
          <div className={styles.darkHeader}>
            <span>PAYMENT</span>

            <h2>
              Оплачивайте
              <br />
              как удобно
            </h2>

            <p>
              Доступные способы оплаты зависят от выбранного способа доставки и
              региона.
            </p>
          </div>

          <div className={styles.paymentGrid}>
            {PAYMENT_METHODS.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className={styles.paymentCard}>
                  <Icon size={27} />

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Как это работает</span>
            <h2>От корзины до получения</h2>
          </div>

          <div className={styles.steps}>
            {STEPS.map((step) => (
              <article key={step.number} className={styles.step}>
                <span className={styles.stepNumber}>{step.number}</span>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.notice}>
          <div className={styles.noticeIcon}>
            <CheckCircle2 size={25} />
          </div>

          <div>
            <h2>Важная информация</h2>

            <p>
              Стоимость и сроки доставки могут меняться в зависимости от адреса,
              региона, размера заказа и выбранного способа получения. Финальные
              условия отображаются при оформлении заказа.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
