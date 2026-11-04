import { apiClient } from "@/lib/api-client";
import { normalizeProductListParams } from "@/features/products/utils/product-query-params";

async function getProducts(params = {}, signal) {
  const normalizedParams = normalizeProductListParams(params);

  const response = await apiClient.get("/products", {
    params: normalizedParams,
    signal,
  });

  return response.data.data;
}

async function getProductBySlug({ slug, signal }) {
  const response = await apiClient.get(`/products/${encodeURIComponent(slug)}`, {
    signal,
  });

  return response.data?.data?.product ?? null;
}

export { getProducts, getProductBySlug };
