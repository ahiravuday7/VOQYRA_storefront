import { ShoppingBag, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Currency } from "@/components/common/currency";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { CartDrawerItem } from "@/features/cart/components/cart-drawer-item";
import { useCart } from "@/features/cart/hooks/use-cart";
import {
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/features/cart/hooks/use-cart-mutations";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function CartDrawer() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);

  const isCustomer = Boolean(user) && user.role === "customer";

  const isCartDrawerOpen = useStorefrontUiStore((state) => state.isCartDrawerOpen);

  const setCartDrawerOpen = useStorefrontUiStore((state) => state.setCartDrawerOpen);

  const closeCartDrawer = useStorefrontUiStore((state) => state.closeCartDrawer);

  const cartQuery = useCart({
    enabled: isCustomer,
  });

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

  const handleSignIn = () => {
    closeCartDrawer();

    navigate("/login", {
      state: {
        from: location,
      },
    });
  };

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

  const goTo = (path) => {
    closeCartDrawer();
    navigate(path);
  };

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <SheetContent
        side="right"
        className="motion-sheet flex w-full flex-col bg-porcelain sm:max-w-md"
      >
        <SheetHeader className="border-b border-cloud pb-5 text-left">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <SheetTitle className="font-display text-3xl font-semibold">Your bag</SheetTitle>

              <SheetDescription>
                {isCustomer
                  ? `${cart.totalQuantity} ${cart.totalQuantity === 1 ? "item" : "items"} selected.`
                  : "Sign in to view your bag."}
              </SheetDescription>
            </div>

            {isCustomer && items.length > 0 && (
              <button
                type="button"
                disabled={clearMutation.isPending}
                onClick={handleClear}
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate transition hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />

                {clearMutation.isPending ? "Clearing..." : "Clear"}
              </button>
            )}
          </div>
        </SheetHeader>

        {!isCustomer ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-ink text-white">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </div>

            <h2 className="mt-6 text-xl font-semibold">Sign in to view your bag.</h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate">
              Your cart is securely linked to your customer account.
            </p>

            <Button type="button" className="mt-7" onClick={handleSignIn}>
              Sign in
            </Button>

            <Button type="button" variant="ghost" className="mt-2" onClick={closeCartDrawer}>
              Continue shopping
            </Button>
          </div>
        ) : cartQuery.isPending ? (
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div key={index} className="flex animate-pulse gap-4">
                <div className="h-28 w-22 rounded-lg bg-cloud/60" />

                <div className="flex-1">
                  <div className="h-4 w-3/4 rounded bg-cloud" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-cloud" />
                  <div className="mt-5 h-8 w-28 rounded bg-cloud" />
                </div>
              </div>
            ))}
          </div>
        ) : cartQuery.isError ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <h2 className="text-xl font-semibold">We couldn't load your bag.</h2>

            <p className="mt-2 text-sm text-slate">
              {cartQuery.error?.message ?? "Please try again."}
            </p>

            <Button type="button" className="mt-6" onClick={() => cartQuery.refetch()}>
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-ink text-white">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </div>

            <h2 className="mt-6 text-xl font-semibold">Your bag is empty.</h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate">
              Explore the collection and add something that feels like you.
            </p>

            <Button type="button" className="mt-7" onClick={closeCartDrawer}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <CartDrawerItem
                  key={item.id}
                  item={item}
                  isUpdating={
                    updateMutation.isPending && updateMutation.variables?.itemId === item.id
                  }
                  isRemoving={
                    removeMutation.isPending && removeMutation.variables?.itemId === item.id
                  }
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="border-t border-cloud px-6 py-5">
              {hasUnavailableItems && (
                <div className="mb-4 rounded-lg bg-coral/10 px-4 py-3 text-xs font-medium leading-5 text-coral">
                  Some items need attention before checkout.
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate">Subtotal</span>

                <Currency
                  value={cart.summary?.subtotal ?? 0}
                  currency={cart.summary?.currency ?? "INR"}
                  className="font-semibold"
                />
              </div>

              <p className="mt-2 text-xs text-slate">
                Prices and stock are verified by the backend.
              </p>

              <Button type="button" className="mt-5 w-full" onClick={() => goTo("/cart")}>
                View bag
              </Button>

              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full"
                disabled={hasUnavailableItems}
                onClick={() => goTo("/checkout")}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { CartDrawer };
