import { useMutation, useQueryClient } from "@tanstack/react-query";

import { confirmRazorpayPayment } from "@/features/payments/api/payments-api";
import { queryKeys } from "@/lib/query-keys";

function useConfirmRazorpayPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmRazorpayPayment,

    onSuccess: (result) => {
      /*
       * A finalized captured payment
       * returns the trusted updated Order.
       *
       * Authorized/pending states can
       * legitimately return order = null.
       */
      if (result.order?.id) {
        queryClient.setQueryData(queryKeys.orders.detail(result.order.id), result.order);
      }
    },
  });
}

export { useConfirmRazorpayPayment };
