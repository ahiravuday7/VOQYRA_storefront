import { apiClient } from "@/lib/api-client";

async function initiateOnlinePayment({ orderId }) {
  const response = await apiClient.post(`/orders/${encodeURIComponent(orderId)}/payments`, {
    provider: "razorpay",
  });

  const data = response.data?.data;

  const payment = data?.payment;

  const checkout = data?.checkout;

  const validCheckout =
    checkout?.keyId &&
    checkout?.orderId &&
    Number.isSafeInteger(checkout?.amount) &&
    checkout.amount > 0 &&
    checkout?.currency;

  if (!payment?.id || !validCheckout) {
    throw new Error("Payment initiation response is incomplete.");
  }

  return {
    action: data.action,

    payment,

    checkout,
  };
}

export { initiateOnlinePayment };
