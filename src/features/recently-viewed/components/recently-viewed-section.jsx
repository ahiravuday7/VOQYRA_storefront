import { History, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { ProductCard } from "@/features/products/components/product-card";
import { useRecentlyViewed } from "@/features/recently-viewed/hooks/use-recently-viewed";
import {
  useClearRecentlyViewed,
  useRemoveRecentlyViewedItem,
} from "@/features/recently-viewed/hooks/use-recently-viewed-mutations";
import { useWishlistManager } from "@/features/wishlist/hooks/use-wishlist-manager";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function RecentlyViewedSection() {
  const user = useAuthStore((state) => state.user);

  const isCustomer = Boolean(user) && user.role === "customer";

  const recentlyViewedQuery = useRecentlyViewed({
    enabled: isCustomer,
  });

  const removeMutation = useRemoveRecentlyViewedItem();

  const clearMutation = useClearRecentlyViewed();

  const { isPendingFor, toggleWishlist, wishlistedProductIds } = useWishlistManager();

  const openQuickShop = useStorefrontUiStore((state) => state.openQuickShop);

  if (!isCustomer) {
    return null;
  }

  if (recentlyViewedQuery.isPending) {
    return (
      <section className="border-t border-cloud py-20 sm:py-24">
        <PageContainer>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Your history
            </p>

            <h2 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Recently viewed
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] rounded-lg bg-cloud/60" />

                <div className="mt-4 h-4 w-3/4 rounded bg-cloud" />

                <div className="mt-3 h-4 w-24 rounded bg-cloud" />
              </div>
            ))}
          </div>
        </PageContainer>
      </section>
    );
  }

  if (recentlyViewedQuery.isError) {
    return null;
  }

  const history = recentlyViewedQuery.data ?? {
    items: [],
    itemCount: 0,
  };

  const items = history.items ?? [];

  if (items.length === 0) {
    return null;
  }

  const availableItems = items.filter((item) => item.isAvailable && item.product).slice(0, 4);

  const handleRemove = async (productId) => {
    try {
      await removeMutation.mutateAsync({
        productId,
      });

      toast.success("Removed from recently viewed.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to remove this item.");
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm("Clear your recently viewed history?");

    if (!confirmed) {
      return;
    }

    try {
      await clearMutation.mutateAsync();

      toast.success("Recently viewed history cleared.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to clear your history.");
    }
  };

  return (
    <section className="motion-reveal border-t border-cloud py-20 sm:py-24">
      <PageContainer>
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Your history
            </p>

            <h2 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Recently viewed
            </h2>

            <p className="mt-3 text-sm text-slate">Pick up where you left off.</p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={clearMutation.isPending}
            onClick={handleClear}
          >
            <Trash2 className="size-4" aria-hidden="true" />

            {clearMutation.isPending ? "Clearing..." : "Clear history"}
          </Button>
        </div>

        {availableItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {availableItems.map((item) => {
              const product = item.product;

              const isRemoving =
                removeMutation.isPending && removeMutation.variables?.productId === item.productId;

              return (
                <div key={item.productId}>
                  <ProductCard
                    product={product}
                    onWishlistClick={toggleWishlist}
                    onQuickShop={(selectedProduct) => openQuickShop(selectedProduct.slug)}
                    isWishlisted={wishlistedProductIds.has(product.id)}
                    isWishlistPending={isPendingFor(product.id)}
                  />

                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() => handleRemove(item.productId)}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate transition hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <History className="size-3.5" aria-hidden="true" />

                    {isRemoving ? "Removing..." : "Remove from history"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-cloud p-6 text-sm text-slate">
            Your recently viewed products are no longer available.
          </div>
        )}
      </PageContainer>
    </section>
  );
}

export { RecentlyViewedSection };
