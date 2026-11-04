import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Currency } from "@/components/common/currency";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

import { CartPageItem } from "@/features/cart/components/cart-page-item";
import { useCart } from "@/features/cart/hooks/use-cart";
import {
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/features/cart/hooks/use-cart-mutations";

function CartPage() {
  const navigate = useNavigate();

  const cartQuery = useCart();

  const updateMutation = useUpdateCartItem();

  const removeMutation = useRemoveCartItem();

  const clearMutation = useClearCart();

  const cart = cartQuery.data ?? {
    items: [],
    itemCount: 0,
    totalQuantity: 0,
    summary: {
      subtotal: 0,
      currency: "INR",
    },
  };

  const items = cart.items ?? [];

  const hasUnavailableItems = items.some((item) => !item.availability?.isAvailable);

  const handleUpdateQuantity = async (item, quantity) => {
    try {
      await updateMutation.mutateAsync({
        itemId: item.id,
        quantity,
      });
    } catch (error) {
      toast.error(error?.message ?? "Unable to update quantity.");
    }
  };

  const handleResolveStock = async (item, quantity) => {
    try {
      await updateMutation.mutateAsync({
        itemId: item.id,
        quantity,
      });

      toast.success("Quantity updated to match current stock.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to update this item.");
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeMutation.mutateAsync({
        itemId: item.id,
      });

      toast.success("Item removed from your bag.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to remove this item.");
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm("Clear all items from your bag?");

    if (!confirmed) {
      return;
    }

    try {
      await clearMutation.mutateAsync();

      toast.success("Your bag has been cleared.");
    } catch (error) {
      toast.error(error?.message ?? "Unable to clear your bag.");
    }
  };

  if (cartQuery.isPending) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <LoadingSkeleton rows={8} />
        </PageContainer>
      </main>
    );
  }

  if (cartQuery.isError) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <ErrorState
            title="We couldn't load your bag."
            description={cartQuery.error?.message ?? "Please try again."}
            onRetry={() => cartQuery.refetch()}
          />
        </PageContainer>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <Breadcrumbs
            items={[
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Your Bag",
              },
            ]}
          />

          <div className="mt-8">
            <EmptyState
              title="Your bag is empty."
              description="Explore the collection and add something that feels like you."
              action={
                <Button asChild size="lg">
                  <Link to="/shop">
                    <ShoppingBag className="size-4" aria-hidden="true" />
                    Start shopping
                  </Link>
                </Button>
              }
            />
          </div>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <PageContainer>
        <Breadcrumbs
          items={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Your Bag",
            },
          ]}
        />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Shopping bag
            </p>

            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Your Bag
            </h1>

            <p className="mt-3 text-sm text-slate">
              {cart.itemCount} {cart.itemCount === 1 ? "style" : "styles"}
              {" · "}
              {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            disabled={clearMutation.isPending}
            onClick={handleClear}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate transition hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden="true" />

            {clearMutation.isPending ? "Clearing..." : "Clear bag"}
          </button>
        </div>

        {hasUnavailableItems && (
          <div className="mt-7 rounded-lg bg-coral/10 px-5 py-4">
            <p className="text-sm font-semibold text-coral">Some items need your attention.</p>

            <p className="mt-1 text-sm leading-6 text-coral">
              Resolve unavailable products, variants, or stock quantities before continuing to
              checkout.
            </p>
          </div>
        )}

        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-14">
          <section className="min-w-0">
            <div className="border-t border-cloud">
              {items.map((item) => (
                <CartPageItem
                  key={item.id}
                  item={item}
                  isUpdating={
                    updateMutation.isPending && updateMutation.variables?.itemId === item.id
                  }
                  isRemoving={
                    removeMutation.isPending && removeMutation.variables?.itemId === item.id
                  }
                  onUpdateQuantity={handleUpdateQuantity}
                  onResolveStock={handleResolveStock}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <Button asChild variant="ghost" className="mt-5">
              <Link to="/shop">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Continue shopping
              </Link>
            </Button>
          </section>

          <aside className="min-w-0 lg:sticky lg:top-28">
            <div className="rounded-xl border border-cloud bg-soft-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                Order summary
              </p>

              <h2 className="mt-2 font-display text-3xl font-semibold">Summary</h2>

              <div className="mt-6 space-y-4 border-b border-cloud pb-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate">Items</span>

                  <span className="font-semibold">{cart.totalQuantity}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate">Subtotal</span>

                  <Currency
                    value={cart.summary?.subtotal ?? 0}
                    currency={cart.summary?.currency ?? "INR"}
                    className="font-semibold"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate">Shipping</span>

                  <span className="font-semibold">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Current subtotal</p>

                  <p className="mt-1 text-xs text-slate">Backend verified</p>
                </div>

                <Currency
                  value={cart.summary?.subtotal ?? 0}
                  currency={cart.summary?.currency ?? "INR"}
                  className="text-xl font-semibold"
                />
              </div>

              {hasUnavailableItems && (
                <p className="mt-4 text-xs leading-5 text-coral">
                  Resolve all cart issues before checkout.
                </p>
              )}

              <Button
                type="button"
                size="lg"
                className="mt-6 w-full"
                disabled={hasUnavailableItems}
                onClick={() => navigate("/checkout")}
              >
                Continue to checkout
              </Button>

              <p className="mt-4 text-center text-xs leading-5 text-slate">
                Final shipping and payment details are confirmed during checkout.
              </p>
            </div>
          </aside>
        </div>
      </PageContainer>
    </main>
  );
}

export { CartPage };
