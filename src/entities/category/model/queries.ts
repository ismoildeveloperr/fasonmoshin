import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "../api/createCategory";
import { deleteCategory } from "../api/deleteCategory";
import { getCategories } from "../api/getCategories";
import { updateCategory } from "../api/updateCategory";

export const CATEGORY_QUERY_KEYS = {
  all: ["categories"] as const,
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.all,
    queryFn: getCategories,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.all,
      });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.all,
      });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.all,
      });
    },
  });
};
