import { useQuery } from "@tanstack/react-query";

import { getCustomerReturnRequest } from "@/features/orders/api/order-returns-api";
import { queryKeys } from "@/lib/query-keys";

function useReturnRequest(returnRequestId) {
  return useQuery({
    queryKey: queryKeys.orders.returnDetail(returnRequestId),

    queryFn: ({ signal }) =>
      getCustomerReturnRequest({
        returnRequestId,
        signal,
      }),

    enabled: Boolean(returnRequestId),
  });
}

export { useReturnRequest };
