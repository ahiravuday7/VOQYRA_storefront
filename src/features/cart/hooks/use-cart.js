import { useQuery } from "@tanstack/react-query";

import { getCart } from "@/features/cart/api/cart-api";
import { queryKeys } from "@/lib/query-keys";

function useCart(options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.cart.current(),

    queryFn: ({ signal }) =>
      getCart({
        signal,
      }),

    enabled,

    staleTime: 60 * 1000,

    ...queryOptions,
  });
}

export { useCart };
