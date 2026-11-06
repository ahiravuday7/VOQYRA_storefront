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

async function getCustomerOrders({ params = {}, signal } = {}) {
  const response = await apiClient.get("/orders", {
    params,
    signal,
  });

  const data = response.data?.data;

  return {
    orders: data?.orders ?? [],
    pagination: data?.pagination ?? {
      page: 1,
      limit: 20,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
    filters: data?.filters ?? {},
  };
}

async function getCustomerOrder({ orderId, signal }) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const response = await apiClient.get(`/orders/${encodeURIComponent(orderId)}`, {
    signal,
  });

  const order = response.data?.data?.order;

  if (!order) {
    throw new Error("Order response did not contain an order.");
  }

  return order;
}

export { createOrder, getCustomerOrder, getCustomerOrders };
