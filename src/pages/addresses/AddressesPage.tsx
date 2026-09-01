import { Home, MapPin, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  useAddAddressMutation,
  useAddressesQuery,
  useDeleteAddressMutation,
} from "@/entities/address";
import { getAuthUser } from "@/features/auth";
import { Loader } from "@/shared/ui/Loader";
import { ProfileLayout } from "@/widgets/ProfileLayout";

import styles from "./AddressesPage.module.scss";

export const AddressesPage = () => {
  const currentUser = getAuthUser();

  const { data: addresses = [], isLoading } = useAddressesQuery();

  const addAddress = useAddAddressMutation();

  const deleteAddress = useDeleteAddressMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [title, setTitle] = useState("Дом");

  const [city, setCity] = useState("");

  const [street, setStreet] = useState("");

  const [house, setHouse] = useState("");

  const [apartment, setApartment] = useState("");

  const [phone, setPhone] = useState("");

  const [isDefault, setIsDefault] = useState(false);

  if (!currentUser) {
    return null;
  }

  const userAddresses = addresses.filter(
    (address) => String(address.userId) === String(currentUser.id),
  );

  const resetForm = () => {
    setTitle("Дом");
    setCity("");
    setStreet("");
    setHouse("");
    setApartment("");
    setPhone("");
    setIsDefault(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addAddress.mutate(
      {
        userId: currentUser.id,
        title: title.trim(),
        city: city.trim(),
        street: street.trim(),
        house: house.trim(),
        apartment: apartment.trim() || undefined,
        phone: phone.trim(),
        isDefault,
      },
      {
        onSuccess: () => {
          closeForm();
        },
      },
    );
  };

  return (
    <ProfileLayout title="Адреса" description="Управляйте адресами доставки.">
      <div className={styles.top}>
        <div>
          <span>
            {userAddresses.length}{" "}
            {userAddresses.length === 1 ? "адрес" : "адресов"}
          </span>
        </div>

        <button type="button" onClick={() => setIsFormOpen(true)}>
          <Plus size={17} />
          Добавить адрес
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : userAddresses.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <MapPin size={34} />
          </div>

          <h2>Адресов пока нет</h2>

          <p>Добавьте первый адрес, чтобы быстрее оформлять заказы.</p>

          <button type="button" onClick={() => setIsFormOpen(true)}>
            <Plus size={17} />
            Добавить адрес
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {userAddresses.map((address) => (
            <article key={address.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.addressIcon}>
                  <Home size={20} />
                </div>

                <div className={styles.cardTitle}>
                  <strong>{address.title}</strong>

                  {address.isDefault && <span>Основной</span>}
                </div>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => deleteAddress.mutate(address.id)}
                  aria-label="Удалить адрес"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className={styles.addressText}>
                <MapPin size={16} />

                <p>
                  {address.city}, {address.street}, д. {address.house}
                  {address.apartment ? `, кв. ${address.apartment}` : ""}
                </p>
              </div>

              <span className={styles.phone}>{address.phone}</span>
            </article>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className={styles.overlay}>
          <button
            type="button"
            className={styles.backdrop}
            onClick={closeForm}
            aria-label="Закрыть"
          />

          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <span>Новый адрес</span>

                <h2>Добавить адрес</h2>
              </div>

              <button type="button" onClick={closeForm} aria-label="Закрыть">
                <X size={21} />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                <span>Название</span>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Дом"
                  required
                />
              </label>

              <label>
                <span>Город</span>

                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Душанбе"
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

              <div className={styles.formRow}>
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

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(event) => setIsDefault(event.target.checked)}
                />

                <span>Использовать как основной адрес</span>
              </label>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={addAddress.isPending}
              >
                {addAddress.isPending ? "Сохраняем..." : "Сохранить адрес"}
              </button>
            </form>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
};
