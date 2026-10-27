import { useEffect } from "react";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getAuthUser } from "@/features/auth/utils/get-auth-user";

function useAuthBootstrap() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const currentUserQuery = useCurrentUser();

  const authUser = currentUserQuery.isSuccess ? getAuthUser(currentUserQuery.data) : null;

  useEffect(() => {
    if (currentUserQuery.isSuccess) {
      if (authUser) {
        setUser(authUser);
      } else {
        clearAuth();
      }
    }

    if (currentUserQuery.isError) {
      clearAuth();
    }
  }, [authUser, clearAuth, currentUserQuery.isError, currentUserQuery.isSuccess, setUser]);

  let isStoreSynchronized = false;

  if (currentUserQuery.isSuccess && authUser) {
    isStoreSynchronized =
      isAuthenticated && user?.id === authUser.id && user?.role === authUser.role;
  }

  if (currentUserQuery.isSuccess && !authUser) {
    isStoreSynchronized = !isAuthenticated && !user;
  }

  if (currentUserQuery.isError) {
    isStoreSynchronized = !isAuthenticated && !user;
  }

  const isBootstrapping = currentUserQuery.isPending || !isStoreSynchronized;

  return {
    ...currentUserQuery,
    isBootstrapping,
  };
}

export { useAuthBootstrap };
