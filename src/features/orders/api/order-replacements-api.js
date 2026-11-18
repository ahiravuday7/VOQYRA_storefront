import { apiClient } from "@/lib/api-client";

async function getCustomerReplacements({ params = {}, signal } = {}) {
  const response = await apiClient.get("/orders/replacements", {
    params,
    signal,
  });

  const data = response.data?.data;

  return {
    replacements: data?.replacements ?? [],

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

async function getCustomerReplacement({ replacementId, signal }) {
  if (!replacementId) {
    throw new Error("Replacement ID is required.");
  }

  const response = await apiClient.get(
    `/orders/replacements/${encodeURIComponent(replacementId)}`,
    {
      signal,
    },
  );

  const replacement = response.data?.data?.replacement;

  if (!replacement) {
    throw new Error("Replacement response did not contain a replacement.");
  }

  return replacement;
}

export { getCustomerReplacement, getCustomerReplacements };
