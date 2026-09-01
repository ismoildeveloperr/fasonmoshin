import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createOrder } from "../api/createOrder";
import { getOrders } from "../api/getOrders";
import { updateOrder } from "../api/updateOrder";

export const ORDER_QUERY_KEYS = {
  all: ["orders"] as const,
};

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.all,
    queryFn: getOrders,
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.all,
      });
    },
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.all,
      });
    },
  });
};
