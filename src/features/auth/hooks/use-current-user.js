import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/auth/api/auth-api";
import { queryKeys } from "@/lib/query-keys";

function useCurrentUser(options = {}) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export { useCurrentUser };
