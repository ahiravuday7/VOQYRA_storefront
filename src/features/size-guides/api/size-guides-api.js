import { apiClient } from "@/lib/api-client";

async function getSizeGuides({ signal } = {}) {
  const response = await apiClient.get("/size-guides", {
    signal,
  });

  return response.data?.data?.sizeGuides ?? [];
}

async function getSizeGuideBySlug({ slug, signal }) {
  const response = await apiClient.get(`/size-guides/${encodeURIComponent(slug)}`, {
    signal,
  });

  return response.data?.data?.sizeGuide ?? null;
}

export { getSizeGuideBySlug, getSizeGuides };
