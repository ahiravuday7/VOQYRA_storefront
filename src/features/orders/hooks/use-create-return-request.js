import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCustomerReturnRequest } from "@/features/orders/api/order-returns-api";
import { queryKeys } from "@/lib/query-keys";

function useCreateReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerReturnRequest,

    onSuccess: async (returnRequest) => {
      queryClient.setQueryData(queryKeys.orders.returnDetail(returnRequest.id), returnRequest);

      /*
       * Part 43 will connect the
       * customer Return history page.
       *
       * This prefix invalidation will
       * already keep that future list
       * synchronized.
       */
      await queryClient.invalidateQueries({
        queryKey: queryKeys.orders.returnLists(),
      });
    },
  });
}

export { useCreateReturnRequest };
