import { useQuery } from "@tanstack/react-query";

import { getBrands } from "@/features/brands/api/brands-api";
import { queryKeys } from "@/lib/query-keys";

function useBrands(params = {}, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.brands.list(params),

    queryFn: ({ signal }) =>
      getBrands({
        params,
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    enabled,

    ...queryOptions,
  });
}

export { useBrands };
