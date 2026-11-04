import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProducts } from "@/features/products/api/products-api";
import { productQueryKeys } from "@/features/products/product-query-keys";
import { normalizeProductListParams } from "@/features/products/utils/product-query-params";

function useProducts(params = {}) {
  const normalizedParams = normalizeProductListParams(params);

  return useQuery({
    queryKey: productQueryKeys.list(normalizedParams),

    queryFn: ({ signal }) => getProducts(normalizedParams, signal),

    placeholderData: keepPreviousData,

    staleTime: 30 * 1000,
  });
}

export { useProducts };
