import {
  Clock3,
  Share2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import styles from "./ContactsPage.module.scss";

const CONTACTS = [
  {
    icon: Phone,
    label: "Телефон",
    value: "+992 00 000 00 00",
    href: "tel:+992000000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@fasonmoshin.tj",
    href: "mailto:info@fasonmoshin.tj",
  },
  {
    icon: Send,
    label: "Telegram",
    value: "@fasonmoshin",
    href: "#",
  },
];

export const ContactsPage = () => {
  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>FASONMOSHIN SUPPORT</span>

            <h1>
              Мы всегда
              <span> на связи</span>
            </h1>

            <p>
              Есть вопрос по товару, доставке или заказу? Свяжитесь с нами
              удобным способом — мы постараемся помочь максимально быстро.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <MessageCircle size={38} />

              <span>SUPPORT</span>

              <strong>
                LET'S
                <br />
                TALK
              </strong>

              <p>FasonMoshin</p>
            </div>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.sectionHeader}>
            <span>Связаться с нами</span>

            <h2>Выберите удобный способ</h2>
          </div>

          <div className={styles.contactGrid}>
            {CONTACTS.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={styles.contactCard}
                >
                  <div className={styles.contactIcon}>
                    <Icon size={23} />
                  </div>

                  <div>
                    <span>{item.label}</span>

                    <strong>{item.value}</strong>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className={styles.infoGrid}>
          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <MapPin size={24} />
            </div>

            <div>
              <span className={styles.infoLabel}>Адрес</span>

              <h3>Душанбе, Таджикистан</h3>

              <p>
                Точный адрес магазина или пункта выдачи можно указать здесь
                после его добавления.
              </p>
            </div>
          </article>

          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Clock3 size={24} />
            </div>

            <div>
              <span className={styles.infoLabel}>Время работы</span>

              <h3>Пн — Вс</h3>

              <p>09:00 — 20:00</p>
            </div>
          </article>
        </section>

        <section className={styles.feedback}>
          <div className={styles.feedbackInfo}>
            <span>Обратная связь</span>

            <h2>Напишите нам</h2>

            <p>Заполните форму, и мы свяжемся с вами в ближайшее время.</p>

            <div className={styles.socialBlock}>
              <span>Мы в социальных сетях</span>

              <div>
                <a href="#" aria-label="Instagram">
                  <Share2 size={19} />
                </a>

                <a href="#" aria-label="Telegram">
                  <Send size={19} />
                </a>

                <a href="#" aria-label="WhatsApp">
                  <MessageCircle size={19} />
                </a>
              </div>
            </div>
          </div>

          <form
            className={styles.form}
            onSubmit={(event) => event.preventDefault()}
          >
            <div className={styles.formRow}>
              <label>
                <span>Имя</span>

                <input type="text" placeholder="Ваше имя" />
              </label>

              <label>
                <span>Телефон</span>

                <input type="tel" placeholder="+992" />
              </label>
            </div>

            <label>
              <span>Email</span>

              <input type="email" placeholder="example@mail.com" />
            </label>

            <label>
              <span>Тема</span>

              <input type="text" placeholder="Например: вопрос по заказу" />
            </label>

            <label>
              <span>Сообщение</span>

              <textarea rows={6} placeholder="Напишите ваше сообщение..." />
            </label>

            <button type="submit">
              Отправить сообщение
              <Send size={17} />
            </button>
          </form>
        </section>

        <section className={styles.mapSection}>
          <div>
            <span>LOCATION</span>

            <h2>Мы на карте</h2>

            <p>
              Позже сюда можно подключить реальную карту через Google Maps,
              Yandex Maps или 2GIS.
            </p>
          </div>

          <div className={styles.mapPlaceholder}>
            <MapPin size={32} />

            <strong>FasonMoshin</strong>

            <span>Душанбе, Таджикистан</span>
          </div>
        </section>
      </div>
    </main>
  );
};
