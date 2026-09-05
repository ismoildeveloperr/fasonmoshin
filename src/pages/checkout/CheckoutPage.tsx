import {
  Banknote,
  Check,
  ChevronLeft,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useCartQuery, useDeleteCartItemMutation } from "@/entities/cart";
import { useCreateOrderMutation } from "@/entities/order";
import type { OrderDeliveryMethod, OrderPaymentMethod } from "@/entities/order";
import { useProductsQuery } from "@/entities/product";
import { getAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { Loader } from "@/shared/ui/Loader";

import styles from "./CheckoutPage.module.scss";
import { getPublicImageUrl } from "@/shared/lib";

export const CheckoutPage = () => {
  const navigate = useNavigate();

  const currentUser = getAuthUser();

  const { data: cart = [], isLoading: isCartLoading } = useCartQuery();

  const { data: products = [], isLoading: isProductsLoading } =
    useProductsQuery();

  const createOrder = useCreateOrderMutation();

  const deleteCartItem = useDeleteCartItemMutation();

  const [name, setName] = useState(currentUser?.name ?? "");

  const [phone, setPhone] = useState(currentUser?.phone ?? "");

  const [email, setEmail] = useState(currentUser?.email ?? "");

  const [city, setCity] = useState("Душанбе");

  const [street, setStreet] = useState("");

  const [house, setHouse] = useState("");

  const [apartment, setApartment] = useState("");

  const [comment, setComment] = useState("");

  const [deliveryMethod, setDeliveryMethod] =
    useState<OrderDeliveryMethod>("courier");

  const [paymentMethod, setPaymentMethod] =
    useState<OrderPaymentMethod>("cash");

  const [error, setError] = useState("");

  if (!currentUser) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (isCartLoading || isProductsLoading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <Loader />
        </div>
      </main>
    );
  }

  const userCart = cart.filter(
    (item) => String(item.userId) === String(currentUser.id),
  );

  const checkoutProducts = userCart
    .map((cartItem) => {
      const product = products.find(
        (item) => String(item.id) === String(cartItem.productId),
      );

      if (!product) {
        return null;
      }

      return {
        cartItem,
        product,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (checkoutProducts.length === 0) {
    return <Navigate to={ROUTES.cart} replace />;
  }

  const productsPrice = checkoutProducts.reduce(
    (total, item) => total + item.product.price * item.cartItem.quantity,
    0,
  );

  const oldProductsPrice = checkoutProducts.reduce(
    (total, item) =>
      total +
      (item.product.oldPrice ?? item.product.price) * item.cartItem.quantity,
    0,
  );

  const discount = Math.max(0, oldProductsPrice - productsPrice);

  const deliveryPrice =
    deliveryMethod === "pickup" ? 0 : productsPrice >= 500 ? 0 : 20;

  const total = productsPrice + deliveryPrice;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Заполните контактные данные");

      return;
    }

    if (
      deliveryMethod === "courier" &&
      (!city.trim() || !street.trim() || !house.trim())
    ) {
      setError("Укажите адрес доставки");

      return;
    }

    try {
      await createOrder.mutateAsync({
        userId: currentUser.id,

        products: checkoutProducts.map(({ product, cartItem }) => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          image: product.images?.[0],
        })),

        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),

        deliveryMethod,
        paymentMethod,

        address:
          deliveryMethod === "courier"
            ? {
                city: city.trim(),
                street: street.trim(),
                house: house.trim(),
                apartment: apartment.trim() || undefined,
              }
            : undefined,

        comment: comment.trim() || undefined,

        productsPrice,
        deliveryPrice,
        discount,
        total,

        status: "new",

        createdAt: new Date().toISOString(),
      });

      await Promise.all(
        userCart.map((item) => deleteCartItem.mutateAsync(item.id)),
      );

      navigate(ROUTES.orders);
    } catch {
      setError("Не удалось оформить заказ. Попробуйте ещё раз.");
    }
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.top}>
          <Link to={ROUTES.cart}>
            <ChevronLeft size={18} />
            Вернуться в корзину
          </Link>

          <span>Оформление заказа</span>
        </div>

        <div className={styles.heading}>
          <span>FASONMOSHIN</span>

          <h1>Оформление заказа</h1>

          <p>Проверьте данные и выберите удобный способ получения.</p>
        </div>

        <form className={styles.layout} onSubmit={handleSubmit}>
          <div className={styles.content}>
            {/* CONTACTS */}
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <span>01</span>

                <div>
                  <h2>Контактные данные</h2>

                  <p>Для связи по вашему заказу.</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <label>
                  <span>Имя</span>

                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ваше имя"
                    required
                  />
                </label>

                <label>
                  <span>Телефон</span>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+992"
                    required
                  />
                </label>

                <label className={styles.fullField}>
                  <span>Email</span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@mail.com"
                    required
                  />
                </label>
              </div>
            </section>

            {/* DELIVERY */}
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <span>02</span>

                <div>
                  <h2>Способ получения</h2>

                  <p>Выберите доставку или самовывоз.</p>
                </div>
              </div>

              <div className={styles.methodGrid}>
                <button
                  type="button"
                  className={`${styles.method} ${
                    deliveryMethod === "courier" ? styles.selected : ""
                  }`}
                  onClick={() => setDeliveryMethod("courier")}
                >
                  <Truck size={23} />

                  <div>
                    <strong>Курьер</strong>

                    <span>Доставка по адресу</span>
                  </div>

                  {deliveryMethod === "courier" && <Check size={18} />}
                </button>

                <button
                  type="button"
                  className={`${styles.method} ${
                    deliveryMethod === "pickup" ? styles.selected : ""
                  }`}
                  onClick={() => setDeliveryMethod("pickup")}
                >
                  <Store size={23} />

                  <div>
                    <strong>Самовывоз</strong>

                    <span>Бесплатно</span>
                  </div>

                  {deliveryMethod === "pickup" && <Check size={18} />}
                </button>
              </div>

              {deliveryMethod === "courier" && (
                <div className={styles.address}>
                  <div className={styles.addressTitle}>
                    <MapPin size={19} />

                    <strong>Адрес доставки</strong>
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      <span>Город</span>

                      <input
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        required
                      />
                    </label>

                    <label>
                      <span>Улица</span>

                      <input
                        value={street}
                        onChange={(event) => setStreet(event.target.value)}
                        placeholder="Рудаки"
                        required
                      />
                    </label>

                    <label>
                      <span>Дом</span>

                      <input
                        value={house}
                        onChange={(event) => setHouse(event.target.value)}
                        placeholder="10"
                        required
                      />
                    </label>

                    <label>
                      <span>Квартира</span>

                      <input
                        value={apartment}
                        onChange={(event) => setApartment(event.target.value)}
                        placeholder="25"
                      />
                    </label>
                  </div>
                </div>
              )}
            </section>

            {/* PAYMENT */}
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <span>03</span>

                <div>
                  <h2>Оплата</h2>

                  <p>Выберите удобный способ оплаты.</p>
                </div>
              </div>

              <div className={styles.methodGrid}>
                <button
                  type="button"
                  className={`${styles.method} ${
                    paymentMethod === "cash" ? styles.selected : ""
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote size={23} />

                  <div>
                    <strong>Наличными</strong>

                    <span>При получении</span>
                  </div>

                  {paymentMethod === "cash" && <Check size={18} />}
                </button>

                <button
                  type="button"
                  className={`${styles.method} ${
                    paymentMethod === "card" ? styles.selected : ""
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard size={23} />

                  <div>
                    <strong>Картой</strong>

                    <span>При получении</span>
                  </div>

                  {paymentMethod === "card" && <Check size={18} />}
                </button>
              </div>
            </section>

            {/* COMMENT */}
            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <span>04</span>

                <div>
                  <h2>Комментарий</h2>

                  <p>Необязательно.</p>
                </div>
              </div>

              <textarea
                className={styles.comment}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Комментарий к заказу..."
                rows={5}
              />
            </section>
          </div>

          {/* SUMMARY */}
          <aside className={styles.summary}>
            <div className={styles.summaryTitle}>
              <ShoppingBag size={20} />

              <div>
                <span>Ваш заказ</span>

                <strong>{checkoutProducts.length} товаров</strong>
              </div>
            </div>

            <div className={styles.products}>
              {checkoutProducts.map(({ product, cartItem }) => (
                <div key={cartItem.id} className={styles.product}>
                  <div className={styles.productImage}>
                    {product.images?.[0] ? (
                      <img
                        src={getPublicImageUrl(product.images?.[0])}
                        alt={product.name}
                      />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <strong>{product.name}</strong>

                    <span>
                      {cartItem.quantity} × {product.price} TJS
                    </span>
                  </div>

                  <strong>{product.price * cartItem.quantity} TJS</strong>
                </div>
              ))}
            </div>

            <div className={styles.summaryRows}>
              <div>
                <span>Товары</span>

                <strong>{productsPrice} TJS</strong>
              </div>

              {discount > 0 && (
                <div>
                  <span>Скидка</span>

                  <strong className={styles.discount}>−{discount} TJS</strong>
                </div>
              )}

              <div>
                <span>Доставка</span>

                <strong>
                  {deliveryPrice === 0 ? "Бесплатно" : `${deliveryPrice} TJS`}
                </strong>
              </div>
            </div>

            <div className={styles.total}>
              <span>Итого</span>

              <strong>{total} TJS</strong>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={createOrder.isPending || deleteCartItem.isPending}
            >
              {createOrder.isPending ? "Оформляем..." : "Подтвердить заказ"}
            </button>

            <p className={styles.agreement}>
              Нажимая кнопку, вы подтверждаете правильность указанных данных.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
};
