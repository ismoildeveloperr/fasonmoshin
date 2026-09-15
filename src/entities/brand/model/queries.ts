import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "@/entities/brand";

export const BRAND_QUERY_KEYS = {
  all: ["brands"] as const,
};

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: BRAND_QUERY_KEYS.all,
    queryFn: getBrands,
  });
};

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BRAND_QUERY_KEYS.all,
      });
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BRAND_QUERY_KEYS.all,
      });
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BRAND_QUERY_KEYS.all,
      });
    },
  });
};
