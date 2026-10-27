import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function CartDrawer() {
  const isCartDrawerOpen = useStorefrontUiStore((state) => state.isCartDrawerOpen);

  const setCartDrawerOpen = useStorefrontUiStore((state) => state.setCartDrawerOpen);

  const closeCartDrawer = useStorefrontUiStore((state) => state.closeCartDrawer);

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <SheetContent side="right" className="flex w-full flex-col bg-porcelain sm:max-w-md">
        <SheetHeader className="border-b border-cloud pb-5 text-left">
          <SheetTitle className="font-display text-3xl font-semibold">Your bag</SheetTitle>

          <SheetDescription>Your selected pieces will appear here.</SheetDescription>
        </SheetHeader>

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

        <div className="border-t border-cloud px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate">Subtotal</span>

            <span className="font-semibold">₹0</span>
          </div>

          <Button type="button" className="mt-4 w-full" disabled>
            Checkout
          </Button>

          <p className="mt-3 text-center text-xs text-slate">
            Cart totals will be provided by the backend.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { CartDrawer };
