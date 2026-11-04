import { useQuery } from "@tanstack/react-query";

import { getSizeGuideBySlug } from "@/features/size-guides/api/size-guides-api";
import { queryKeys } from "@/lib/query-keys";

function useSizeGuide(slug, options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: queryKeys.sizeGuides.detail(slug),

    queryFn: ({ signal }) =>
      getSizeGuideBySlug({
        slug,
        signal,
      }),

    staleTime: 15 * 60 * 1000,

    enabled: Boolean(slug) && enabled,

    ...queryOptions,
  });
}

export { useSizeGuide };
