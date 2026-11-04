import { apiClient } from "@/lib/api-client";

async function getBrands({ params = {}, signal } = {}) {
  const response = await apiClient.get("/brands", {
    params,
    signal,
  });

  return response.data?.data?.brands ?? [];
}

async function getBrandBySlug({ slug, signal }) {
  const response = await apiClient.get(`/brands/${encodeURIComponent(slug)}`, {
    signal,
  });

  return response.data?.data?.brand ?? null;
}

export { getBrandBySlug, getBrands };
