import { useQuery } from "@tanstack/react-query";

import { getCustomerReturnRequests } from "@/features/orders/api/order-returns-api";
import { queryKeys } from "@/lib/query-keys";

function useReturnRequests(params = {}) {
  return useQuery({
    queryKey: queryKeys.orders.returnList(params),

    queryFn: ({ signal }) =>
      getCustomerReturnRequests({
        params,
        signal,
      }),
  });
}

export { useReturnRequests };
