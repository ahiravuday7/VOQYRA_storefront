import { useQuery } from "@tanstack/react-query";

import { getCollections } from "@/features/collections/api/collections-api";
import { queryKeys } from "@/lib/query-keys";

function useCollections(params = {}, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.collections.list(params),

    queryFn: ({ signal }) =>
      getCollections({
        params,
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    enabled,

    ...queryOptions,
  });
}

export { useCollections };
