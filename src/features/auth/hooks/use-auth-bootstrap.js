import { useEffect } from "react";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getAuthUser } from "@/features/auth/utils/get-auth-user";

function useAuthBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const currentUserQuery = useCurrentUser();

  useEffect(() => {
    if (currentUserQuery.isSuccess) {
      const user = getAuthUser(currentUserQuery.data);

      if (user) {
        setUser(user);
      } else {
        clearAuth();
      }
    }

    if (currentUserQuery.isError) {
      clearAuth();
    }
  }, [
    clearAuth,
    currentUserQuery.data,
    currentUserQuery.isError,
    currentUserQuery.isSuccess,
    setUser,
  ]);

  return currentUserQuery;
}

export { useAuthBootstrap };
