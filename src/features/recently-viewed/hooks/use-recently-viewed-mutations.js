import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  clearRecentlyViewed,
  recordRecentlyViewed,
  removeRecentlyViewedItem,
} from "@/features/recently-viewed/api/recently-viewed-api";
import { queryKeys } from "@/lib/query-keys";

function useRecordRecentlyViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordRecentlyViewed,

    onSuccess: (recentlyViewed) => {
      queryClient.setQueryData(queryKeys.recentlyViewed.current(), recentlyViewed);
    },
  });
}

function useRemoveRecentlyViewedItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeRecentlyViewedItem,

    onSuccess: (recentlyViewed) => {
      queryClient.setQueryData(queryKeys.recentlyViewed.current(), recentlyViewed);
    },
  });
}

function useClearRecentlyViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearRecentlyViewed,

    onSuccess: (recentlyViewed) => {
      queryClient.setQueryData(queryKeys.recentlyViewed.current(), recentlyViewed);
    },
  });
}

export { useClearRecentlyViewed, useRecordRecentlyViewed, useRemoveRecentlyViewedItem };
