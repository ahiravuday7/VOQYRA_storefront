import { useQuery } from "@tanstack/react-query";

import { getCategoryTree } from "@/features/categories/api/categories-api";
import { queryKeys } from "@/lib/query-keys";

function useCategoryTree(options = {}) {
  return useQuery({
    queryKey: queryKeys.categories.tree(),

    queryFn: ({ signal }) =>
      getCategoryTree({
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    ...options,
  });
}

export { useCategoryTree };
