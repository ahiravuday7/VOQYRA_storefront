import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { queryKeys } from "@/lib/query-keys";

function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      clearAuth();

      queryClient.removeQueries({
        queryKey: queryKeys.auth.all,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.cart.all,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.wishlist.all,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.recentlyViewed.all,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.orders.all,
      });
    },
  });
}

export { useLogout };
