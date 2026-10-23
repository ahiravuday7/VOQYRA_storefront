import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/features/auth/api/auth-api";
import { authQueryKeys } from "@/features/auth/api/auth-query-keys";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getAuthUser } from "@/features/auth/utils/get-auth-user";

function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      const user = getAuthUser(data);

      if (user) {
        setUser(user);

        queryClient.setQueryData(authQueryKeys.currentUser(), data);
      } else {
        queryClient.invalidateQueries({
          queryKey: authQueryKeys.currentUser(),
        });
      }
    },
  });
}

export { useLogin };
