export { addFavorite } from "./api/addFavorite";
export { deleteFavorite } from "./api/deleteFavorite";
export { getFavorites } from "./api/getFavorites";

export {
  FAVORITE_QUERY_KEYS,
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useFavoritesQuery,
} from "./model/queries";

export type { Favorite } from "./model/types";
