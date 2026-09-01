type ErrorStateProps = {
  title?: string;
  onRetry?: () => void;
};

export const ErrorState = ({
  title = "Произошла ошибка",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div>
      <p>{title}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
};
