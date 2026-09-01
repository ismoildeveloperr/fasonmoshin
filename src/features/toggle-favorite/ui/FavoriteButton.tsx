import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useFavoritesQuery,
} from "@/entities/favorite";
import { getAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";

type FavoriteButtonProps = {
  productId: string | number;
  className?: string;
};

export const FavoriteButton = ({
  productId,
  className,
}: FavoriteButtonProps) => {
  const navigate = useNavigate();

  const currentUser = getAuthUser();

  const { data: favorites = [] } = useFavoritesQuery();

  const addFavorite = useAddFavoriteMutation();
  const deleteFavorite = useDeleteFavoriteMutation();

  const favorite = currentUser
    ? favorites.find(
        (item) =>
          String(item.productId) === String(productId) &&
          String(item.userId) === String(currentUser.id),
      )
    : undefined;

  const isFavorite = Boolean(favorite);

  const isPending = addFavorite.isPending || deleteFavorite.isPending;

  const handleClick = () => {
    if (!currentUser) {
      navigate(ROUTES.login);

      return;
    }

    if (isPending) {
      return;
    }

    if (favorite) {
      deleteFavorite.mutate(favorite.id);

      return;
    }

    addFavorite.mutate({
      userId: currentUser.id,
      productId,
    });
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
};
