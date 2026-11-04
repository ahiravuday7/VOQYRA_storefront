import { useQuery } from "@tanstack/react-query";

import { getBrandBySlug } from "@/features/brands/api/brands-api";
import { queryKeys } from "@/lib/query-keys";

function useBrand(slug, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.brands.detail(slug),

    queryFn: ({ signal }) =>
      getBrandBySlug({
        slug,
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    enabled: Boolean(slug) && enabled,

    ...queryOptions,
  });
}

export { useBrand };
