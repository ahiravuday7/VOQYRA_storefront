import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/features/categories/api/categories-api";
import { queryKeys } from "@/lib/query-keys";

function useCategories(params = {}, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.categories.list(params),

    queryFn: ({ signal }) =>
      getCategories({
        params,
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    enabled,

    ...queryOptions,
  });
}

export { useCategories };
