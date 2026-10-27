import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getAuthUser } from "@/features/auth/utils/get-auth-user";
import { queryKeys } from "@/lib/query-keys";

function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      const user = getAuthUser(data);

      if (user) {
        setUser(user);

        queryClient.setQueryData(queryKeys.auth.me(), data);
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.me(),
        });
      }
    },
  });
}

export { useLogin };
