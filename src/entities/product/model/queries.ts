import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProduct } from "../api/createProduct";
import { deleteProduct } from "../api/deleteProduct";
import { getProducts } from "../api/getProducts";
import { updateProduct } from "../api/updateProduct";

export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,
};

export const useProductsQuery = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.all,
    queryFn: getProducts,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.all,
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.all,
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.all,
      });
    },
  });
};
