import { useQuery } from "@tanstack/react-query";

import { getProductBySlug } from "@/features/products/api/products-api";
import { productQueryKeys } from "@/features/products/product-query-keys";

function useProduct(slug, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: productQueryKeys.detail(slug),

    queryFn: ({ signal }) =>
      getProductBySlug({
        slug,
        signal,
      }),

    enabled: Boolean(slug) && enabled,

    staleTime: 5 * 60 * 1000,

    ...queryOptions,
  });
}

export { useProduct };
