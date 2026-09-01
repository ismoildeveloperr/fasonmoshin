import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteUser } from "../api/deleteUser";
import { getUsers } from "../api/getUsers";
import { updateUser } from "../api/updateUser";

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.all,
    queryFn: getUsers,
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.all,
      });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.all,
      });
    },
  });
};
