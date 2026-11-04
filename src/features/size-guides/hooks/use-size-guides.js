import { useQuery } from "@tanstack/react-query";

import { getSizeGuides } from "@/features/size-guides/api/size-guides-api";
import { queryKeys } from "@/lib/query-keys";

function useSizeGuides(options = {}) {
  return useQuery({
    queryKey: queryKeys.sizeGuides.list(),

    queryFn: ({ signal }) =>
      getSizeGuides({
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    ...options,
  });
}

export { useSizeGuides };
