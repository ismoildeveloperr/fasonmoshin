import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addAddress } from "../api/addAddress";
import { deleteAddress } from "../api/deleteAddress";
import { getAddresses } from "../api/getAddresses";
import { updateAddress } from "../api/updateAddress";

export const ADDRESS_QUERY_KEYS = {
  all: ["addresses"] as const,
};

export const useAddressesQuery = () => {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEYS.all,
    queryFn: getAddresses,
  });
};

export const useAddAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEYS.all,
      });
    },
  });
};

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEYS.all,
      });
    },
  });
};

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_QUERY_KEYS.all,
      });
    },
  });
};
