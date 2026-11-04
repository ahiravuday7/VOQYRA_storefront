import { apiClient } from "@/lib/api-client";

async function createOrder({ orderData, idempotencyKey }) {
  const response = await apiClient.post("/orders", orderData, {
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });

  const order = response.data?.data?.order;

  if (!order) {
    throw new Error("Order response did not contain an order.");
  }

  return {
    order,

    /*
     * Backend:
     * 201 = newly created
     * 200 = safely reused through
     *       Idempotency-Key
     */
    wasReused: response.status === 200,
  };
}

export { createOrder };
