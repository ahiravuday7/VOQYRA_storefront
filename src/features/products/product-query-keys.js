import { normalizeProductListParams } from "@/features/products/utils/product-query-params";

export const productQueryKeys = {
  all: ["products"],

  lists: () => [...productQueryKeys.all, "list"],

  list: (params = {}) => [...productQueryKeys.lists(), normalizeProductListParams(params)],

  details: () => [...productQueryKeys.all, "detail"],

  detail: (slug) => [...productQueryKeys.details(), slug],
};
