import { useQuery } from "@tanstack/react-query";

import { getWishlist } from "@/features/wishlist/api/wishlist-api";
import { queryKeys } from "@/lib/query-keys";

function useWishlist(options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.wishlist.current(),

    queryFn: ({ signal }) =>
      getWishlist({
        signal,
      }),

    enabled,

    staleTime: 2 * 60 * 1000,

    ...queryOptions,
  });
}

export { useWishlist };
