import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelCustomerReturnRequest } from "@/features/orders/api/order-returns-api";
import { queryKeys } from "@/lib/query-keys";

function useCancelReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCustomerReturnRequest,

    onSuccess: async (returnRequest) => {
      queryClient.setQueryData(queryKeys.orders.returnDetail(returnRequest.id), returnRequest);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.orders.returnLists(),
      });
    },

    onError: async (_error, variables) => {
      if (variables?.returnRequestId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.orders.returnDetail(variables.returnRequestId),
        });
      }
    },
  });
}

export { useCancelReturnRequest };
