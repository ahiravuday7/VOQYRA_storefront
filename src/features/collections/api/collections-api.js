import { apiClient } from "@/lib/api-client";

async function getCollections({ params = {}, signal } = {}) {
  const response = await apiClient.get("/collections", {
    params,
    signal,
  });

  return response.data?.data?.collections ?? [];
}

async function getCollectionBySlug({ slug, signal }) {
  const response = await apiClient.get(`/collections/${encodeURIComponent(slug)}`, {
    signal,
  });

  return response.data?.data?.collection ?? null;
}

export { getCollectionBySlug, getCollections };
