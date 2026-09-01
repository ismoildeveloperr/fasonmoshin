import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addFavorite } from "../api/addFavorite";
import { deleteFavorite } from "../api/deleteFavorite";
import { getFavorites } from "../api/getFavorites";

export const FAVORITE_QUERY_KEYS = {
  all: ["favorites"] as const,
};

export const useFavoritesQuery = () => {
  return useQuery({
    queryKey: FAVORITE_QUERY_KEYS.all,
    queryFn: getFavorites,
  });
};

export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAVORITE_QUERY_KEYS.all,
      });
    },
  });
};

export const useDeleteFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAVORITE_QUERY_KEYS.all,
      });
    },
  });
};
