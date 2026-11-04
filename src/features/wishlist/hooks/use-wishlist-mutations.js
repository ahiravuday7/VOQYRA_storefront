import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addWishlistItem,
  clearWishlist,
  removeWishlistItem,
} from "@/features/wishlist/api/wishlist-api";
import { queryKeys } from "@/lib/query-keys";

function useAddWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWishlistItem,

    onSuccess: (wishlist) => {
      queryClient.setQueryData(queryKeys.wishlist.current(), wishlist);
    },
  });
}

function useRemoveWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWishlistItem,

    onSuccess: (wishlist) => {
      queryClient.setQueryData(queryKeys.wishlist.current(), wishlist);
    },
  });
}

function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearWishlist,

    onSuccess: (wishlist) => {
      queryClient.setQueryData(queryKeys.wishlist.current(), wishlist);
    },
  });
}

export { useAddWishlistItem, useClearWishlist, useRemoveWishlistItem };
