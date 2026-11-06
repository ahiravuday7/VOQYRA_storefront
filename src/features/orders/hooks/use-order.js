import { useQuery } from "@tanstack/react-query";

import { getCustomerOrder } from "@/features/orders/api/orders-api";
import { queryKeys } from "@/lib/query-keys";

function useOrder(orderId) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),

    queryFn: ({ signal }) =>
      getCustomerOrder({
        orderId,
        signal,
      }),

    enabled: Boolean(orderId),
  });
}

export { useOrder };
