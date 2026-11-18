import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelCustomerOrder } from "@/features/orders/api/orders-api";
import { queryKeys } from "@/lib/query-keys";

function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCustomerOrder,

    onSuccess: async (order) => {
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["orders", "list"],
        }),

        /*
         * Cancellation releases reserved
         * Product inventory, so catalog
         * availability may have changed.
         */
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.all,
        }),
      ]);
    },

    onError: async (_error, variables) => {
      /*
       * A race may happen if an admin
       * changes the Order while the
       * customer is cancelling it.
       *
       * Refresh the authoritative Order.
       */
      if (variables?.orderId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.orders.detail(variables.orderId),
        });
      }
    },
  });
}

export { useCancelOrder };
