import { useQuery } from "@tanstack/react-query";

import { getCustomerOrders } from "@/features/orders/api/orders-api";
import { queryKeys } from "@/lib/query-keys";

function useOrders(params = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),

    queryFn: ({ signal }) =>
      getCustomerOrders({
        params,
        signal,
      }),
  });
}

export { useOrders };
