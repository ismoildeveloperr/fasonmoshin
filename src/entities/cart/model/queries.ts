import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addCartItem } from "../api/addCartItem";
import { deleteCartItem } from "../api/deleteCartItem";
import { getCart } from "../api/getCart";
import { updateCartItem } from "../api/updateCartItem";

export const CART_QUERY_KEYS = {
  all: ["cart"] as const,
};

export const useCartQuery = () => {
  return useQuery({
    queryKey: CART_QUERY_KEYS.all,
    queryFn: getCart,
  });
};

export const useAddCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEYS.all,
      });
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEYS.all,
      });
    },
  });
};

export const useDeleteCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEYS.all,
      });
    },
  });
};
