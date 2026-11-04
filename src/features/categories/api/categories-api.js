import { apiClient } from "@/lib/api-client";

async function getCategories({ params = {}, signal } = {}) {
  const response = await apiClient.get("/categories", {
    params,
    signal,
  });

  return response.data?.data?.categories ?? [];
}

async function getCategoryTree({ signal } = {}) {
  const response = await apiClient.get("/categories/tree", {
    signal,
  });

  return response.data?.data?.categories ?? [];
}

async function getCategoryBySlug({ slug, signal }) {
  const response = await apiClient.get(`/categories/${encodeURIComponent(slug)}`, {
    signal,
  });

  return response.data?.data?.category ?? null;
}

export { getCategories, getCategoryBySlug, getCategoryTree };
