import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { CustomerRoute } from "@/app/router/customer-route";
import { GuestRoute } from "@/app/router/guest-route";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { PageContainer } from "@/components/common/page-container";

import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";

import { CategoryPage } from "@/features/categories/pages/category-page";

import { BrandPage } from "@/features/brands/pages/brand-page";
import { BrandsPage } from "@/features/brands/pages/brands-page";

import { CollectionPage } from "@/features/collections/pages/collection-page";
import { CollectionsPage } from "@/features/collections/pages/collections-page";

import { HomePage } from "@/features/home/pages/home-page";

import { ShopPage } from "@/features/products/pages/shop-page";
import { ProductPage } from "@/features/products/pages/product-page";

import { WishlistPage } from "@/features/wishlist/pages/wishlist-page";
import { CartPage } from "@/features/cart/pages/cart-page";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";

function AccountPlaceholder() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      navigate("/", {
        replace: true,
      });
    } catch {
      // Logout error handling can be polished
      // when we build the full Account area.
    }
  };

  return (
    <main className="min-h-screen py-12">
      <PageContainer>
        <h1 className="font-display text-4xl font-semibold">My Account</h1>

        <p className="mt-3 text-slate">Customer account area is protected successfully.</p>

        <Button
          type="button"
          variant="outline"
          className="mt-6"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
        >
          {logoutMutation.isPending ? "Signing out..." : "Sign out"}
        </Button>
      </PageContainer>
    </main>
  );
}

function CheckoutPlaceholder() {
  return (
    <main className="min-h-screen py-12">
      <PageContainer>
        <h1 className="font-display text-4xl font-semibold">Checkout</h1>

        <p className="mt-3 text-slate">Checkout form comes in Part 32.</p>
      </PageContainer>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route element={<CustomerRoute />}>
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<CheckoutPlaceholder />} />
          <Route path="/account" element={<AccountPlaceholder />} />
        </Route>

        <Route path="/shop" element={<ShopPage />} />
        <Route path="/search" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />

        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brand/:slug" element={<BrandPage />} />

        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collection/:slug" element={<CollectionPage />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
