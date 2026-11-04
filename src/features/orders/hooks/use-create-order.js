import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createOrder } from "@/features/orders/api/orders-api";
import { queryKeys } from "@/lib/query-keys";

function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: ({ order }) => {
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);
    },
  });
}

export { useCreateOrder };
