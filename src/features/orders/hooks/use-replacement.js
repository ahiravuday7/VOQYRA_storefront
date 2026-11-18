import { useQuery } from "@tanstack/react-query";

import { getCustomerReplacement } from "@/features/orders/api/order-replacements-api";
import { queryKeys } from "@/lib/query-keys";

function useReplacement(replacementId) {
  return useQuery({
    queryKey: queryKeys.orders.replacementDetail(replacementId),

    queryFn: ({ signal }) =>
      getCustomerReplacement({
        replacementId,
        signal,
      }),

    enabled: Boolean(replacementId),
  });
}

export { useReplacement };
