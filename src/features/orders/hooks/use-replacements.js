import { useQuery } from "@tanstack/react-query";

import { getCustomerReplacements } from "@/features/orders/api/order-replacements-api";
import { queryKeys } from "@/lib/query-keys";

function useReplacements(params = {}) {
  return useQuery({
    queryKey: queryKeys.orders.replacementList(params),

    queryFn: ({ signal }) =>
      getCustomerReplacements({
        params,
        signal,
      }),
  });
}

export { useReplacements };
