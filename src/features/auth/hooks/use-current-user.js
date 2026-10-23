import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/auth/api/auth-api";
import { authQueryKeys } from "@/features/auth/api/auth-query-keys";

function useCurrentUser(options = {}) {
  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export { useCurrentUser };
