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

export { createCustomerReturnRequest };
