import { useQuery } from "@tanstack/react-query";

import { getCollectionBySlug } from "@/features/collections/api/collections-api";
import { queryKeys } from "@/lib/query-keys";

function useCollection(slug, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.collections.detail(slug),

    queryFn: ({ signal }) =>
      getCollectionBySlug({
        slug,
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    enabled: Boolean(slug) && enabled,

    ...queryOptions,
  });
}

export { useCollection };
