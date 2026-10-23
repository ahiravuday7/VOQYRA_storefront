import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "@/features/auth/api/auth-api";
import { authQueryKeys } from "@/features/auth/api/auth-query-keys";
import { useAuthStore } from "@/features/auth/store/auth-store";

function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      clearAuth();

      queryClient.removeQueries({
        queryKey: authQueryKeys.all,
      });
    },
  });
}

export { useLogout };
