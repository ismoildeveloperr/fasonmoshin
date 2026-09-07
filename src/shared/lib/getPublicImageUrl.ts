export const getPublicImageUrl = (path?: string | null): string => {
  if (!path) {
    return "";
  }

  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return "";
  }

  if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
    return trimmedPath;
  }

  const normalizedPath = trimmedPath.replace(/^\/+/, "");

  return `${import.meta.env.BASE_URL}${normalizedPath}`;
};
