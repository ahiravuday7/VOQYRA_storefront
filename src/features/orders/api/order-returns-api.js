import { apiClient } from "@/lib/api-client";

async function createCustomerReturnRequest({ orderId, returnData }) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const response = await apiClient.post(
    `/orders/${encodeURIComponent(orderId)}/returns`,
    returnData,
  );

  const returnRequest = response.data?.data?.returnRequest;

  if (!returnRequest) {
    throw new Error("Return request response did not contain a return request.");
  }

  return returnRequest;
}

async function getCustomerReturnRequests({ params = {}, signal } = {}) {
  const response = await apiClient.get("/orders/returns", {
    params,
    signal,
  });

  const data = response.data?.data;

  return {
    returnRequests: data?.returnRequests ?? [],

    pagination: data?.pagination ?? {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  };
}

async function getCustomerReturnRequest({ returnRequestId, signal }) {
  if (!returnRequestId) {
    throw new Error("Return request ID is required.");
  }

  const response = await apiClient.get(`/orders/returns/${encodeURIComponent(returnRequestId)}`, {
    signal,
  });

  const returnRequest = response.data?.data?.returnRequest;

  if (!returnRequest) {
    throw new Error("Return request response did not contain a return request.");
  }

  return returnRequest;
}

async function cancelCustomerReturnRequest({ returnRequestId, reason }) {
  if (!returnRequestId) {
    throw new Error("Return request ID is required.");
  }

  const response = await apiClient.post(
    `/orders/returns/${encodeURIComponent(returnRequestId)}/cancel`,
    {
      reason,
    },
  );

  const returnRequest = response.data?.data?.returnRequest;

  if (!returnRequest) {
    throw new Error("Return cancellation response did not contain a return request.");
  }

  return returnRequest;
}

export {
  cancelCustomerReturnRequest,
  createCustomerReturnRequest,
  getCustomerReturnRequest,
  getCustomerReturnRequests,
};
