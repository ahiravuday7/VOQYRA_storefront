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

async function confirmRazorpayPayment({
  orderId,
  paymentTransactionId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const response = await apiClient.post(
    `/orders/${encodeURIComponent(orderId)}/payments/${encodeURIComponent(
      paymentTransactionId,
    )}/confirm`,
    {
      razorpay_order_id: razorpayOrderId,

      razorpay_payment_id: razorpayPaymentId,

      razorpay_signature: razorpaySignature,
    },
  );

  const data = response.data?.data;

  if (!data?.payment || !data?.providerState || !data?.orderFinalization) {
    throw new Error("Payment confirmation response is incomplete.");
  }

  return {
    action: data.action ?? null,

    providerState: data.providerState,

    orderFinalization: data.orderFinalization,

    payment: data.payment,

    order: data.order ?? null,
  };
}

export { confirmRazorpayPayment, initiateOnlinePayment };
