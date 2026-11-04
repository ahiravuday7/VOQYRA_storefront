import { useQuery } from "@tanstack/react-query";

import { getRecentlyViewed } from "@/features/recently-viewed/api/recently-viewed-api";
import { queryKeys } from "@/lib/query-keys";

function useRecentlyViewed(options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.recentlyViewed.current(),

    queryFn: ({ signal }) =>
      getRecentlyViewed({
        signal,
      }),

    enabled,

    staleTime: 2 * 60 * 1000,

    ...queryOptions,
  });
}

export { useRecentlyViewed };
