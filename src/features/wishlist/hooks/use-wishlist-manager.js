import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import {
  useAddWishlistItem,
  useRemoveWishlistItem,
} from "@/features/wishlist/hooks/use-wishlist-mutations";

function useWishlistManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);

  const isAuthenticated = Boolean(user) && user.role === "customer";

  const wishlistQuery = useWishlist({
    enabled: isAuthenticated,
  });

  const addMutation = useAddWishlistItem();

  const removeMutation = useRemoveWishlistItem();

  const wishlist = wishlistQuery.data ?? {
    id: null,
    items: [],
    itemCount: 0,
  };

  const wishlistedProductIds = useMemo(
    () => new Set(wishlist.items.map((item) => item.productId).filter(Boolean)),
    [wishlist.items],
  );

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.info("Sign in to save products to your wishlist.");

      navigate("/login", {
        state: {
          from: location,
        },
      });

      return;
    }

    const productId = product?.id ?? product?.productId;

    if (!productId) {
      return;
    }

    const alreadySaved = wishlistedProductIds.has(productId);

    try {
      if (alreadySaved) {
        await removeMutation.mutateAsync({
          productId,
        });

        toast.success("Removed from wishlist.");

        return;
      }

      await addMutation.mutateAsync({
        productId,
      });

      toast.success("Saved to wishlist.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to update your wishlist.");
    }
  };

  const isPendingFor = (productId) => {
    const addingProductId = addMutation.variables?.productId;

    const removingProductId = removeMutation.variables?.productId;

    return Boolean(
      (addMutation.isPending && addingProductId === productId) ||
      (removeMutation.isPending && removingProductId === productId),
    );
  };

  return {
    isAuthenticated,
    isPendingFor,
    toggleWishlist,
    wishlist,
    wishlistQuery,
    wishlistedProductIds,
  };
}

export { useWishlistManager };
