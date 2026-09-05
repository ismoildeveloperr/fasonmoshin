export const getPublicImageUrl = (path?: string | null): string => {
  if (!path) {
    return "";
  }

  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return "";
  }

  // Внешняя картинка
  if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
    return trimmedPath;
  }

  // Убираем начальный /
  const normalizedPath = trimmedPath.replace(/^\/+/, "");

  // import.meta.env.BASE_URL:
  // локально -> /
  // GitHub Pages -> /fasonmoshin/
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
};
