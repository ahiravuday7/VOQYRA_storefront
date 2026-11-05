import { useMutation } from "@tanstack/react-query";

import { initiateOnlinePayment } from "@/features/payments/api/payments-api";

function useInitiateOnlinePayment() {
  return useMutation({
    mutationFn: initiateOnlinePayment,
  });
}

export { useInitiateOnlinePayment };
