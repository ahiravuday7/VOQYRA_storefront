import { Outlet } from "react-router-dom";

import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { SearchOverlay } from "@/features/search/components/search-overlay";

function StorefrontLayout() {
  return (
    <div className="min-h-screen bg-porcelain text-ink">
      <StorefrontHeader />

      <div className="min-h-[70vh]">
        <Outlet />
      </div>

      <StorefrontFooter />

      <CartDrawer />
      <SearchOverlay />
    </div>
  );
}

export { StorefrontLayout };
