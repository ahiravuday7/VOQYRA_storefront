import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

import { ProductGrid } from "@/features/products/components/product-grid";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import {
  useClearWishlist,
  useRemoveWishlistItem,
} from "@/features/wishlist/hooks/use-wishlist-mutations";

function WishlistPage() {
  const wishlistQuery = useWishlist();

  const clearMutation = useClearWishlist();

  const removeMutation = useRemoveWishlistItem();

  const openQuickShop = useStorefrontUiStore((state) => state.openQuickShop);

  if (wishlistQuery.isPending) {
    return (
      <PageContainer>
        <div className="py-12 sm:py-16">
          <LoadingSkeleton rows={6} />
        </div>
      </PageContainer>
    );
  }

  if (wishlistQuery.isError) {
    return (
      <PageContainer>
        <div className="py-12 sm:py-16">
          <ErrorState
            title="Wishlist unavailable."
            description={wishlistQuery.error?.message ?? "We couldn't load your wishlist."}
            onRetry={() => wishlistQuery.refetch()}
          />
        </div>
      </PageContainer>
    );
  }

  const wishlist = wishlistQuery.data;

  const items = wishlist?.items ?? [];

  const availableProducts = items
    .filter((item) => item.isAvailable && item.product)
    .map((item) => item.product);

  const unavailableItems = items.filter((item) => !item.isAvailable || !item.product);

  const handleClear = async () => {
    const confirmed = window.confirm("Clear all products from your wishlist?");

    if (!confirmed) {
      return;
    }

    try {
      await clearMutation.mutateAsync();

      toast.success("Wishlist cleared.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to clear wishlist.");
    }
  };

  const handleRemoveUnavailable = async (productId) => {
    try {
      await removeMutation.mutateAsync({
        productId,
      });

      toast.success("Removed from wishlist.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to remove item.");
    }
  };

  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Saved for later
            </p>

            <h1 className="mt-2 font-display text-5xl font-semibold tracking-[-0.04em]">
              Wishlist
            </h1>

            <p className="mt-3 text-sm text-slate">
              {wishlist?.itemCount ?? 0} {(wishlist?.itemCount ?? 0) === 1 ? "item" : "items"}
            </p>
          </div>

          {items.length > 0 && (
            <Button
              type="button"
              variant="outline"
              disabled={clearMutation.isPending}
              onClick={handleClear}
            >
              <Trash2 className="size-4" aria-hidden="true" />

              {clearMutation.isPending ? "Clearing..." : "Clear wishlist"}
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty."
            description="Save the pieces you love and come back to them anytime."
          />
        ) : (
          <>
            {availableProducts.length > 0 && (
              <ProductGrid
                products={availableProducts}
                onQuickShop={(product) => openQuickShop(product.slug)}
              />
            )}

            {unavailableItems.length > 0 && (
              <section className="mt-14 border-t border-cloud pt-8">
                <h2 className="font-display text-2xl font-semibold">Unavailable items</h2>

                <p className="mt-2 text-sm text-slate">
                  These products are no longer available in the public catalog. You can safely
                  remove them.
                </p>

                <div className="mt-6 space-y-3">
                  {unavailableItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-4 rounded-lg border border-cloud p-4"
                    >
                      <div>
                        <p className="font-semibold">Product unavailable</p>

                        <p className="mt-1 text-xs text-slate">{item.productId}</p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        disabled={removeMutation.isPending}
                        onClick={() => handleRemoveUnavailable(item.productId)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </PageContainer>
    </main>
  );
}

export { WishlistPage };
