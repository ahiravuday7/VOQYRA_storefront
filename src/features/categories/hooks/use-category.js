import { useQuery } from "@tanstack/react-query";

import { getCategoryBySlug } from "@/features/categories/api/categories-api";
import { queryKeys } from "@/lib/query-keys";

function useCategory(slug, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.categories.detail(slug),

    queryFn: ({ signal }) =>
      getCategoryBySlug({
        slug,
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    enabled: Boolean(slug) && enabled,

    ...queryOptions,
  });
}

export { useCategory };
