import styles from "./Loader.module.scss";

type LoaderProps = {
  text?: string;
  fullScreen?: boolean;
};

export const Loader = ({
  text = "Загрузка...",
  fullScreen = false,
}: LoaderProps) => {
  return (
    <div
      className={`${styles.loader} ${fullScreen ? styles.fullScreen : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.spinner} />

      <span>{text}</span>
    </div>
  );
};
