import { Navigate, Route, Routes } from "react-router-dom";

import { CustomerRoute } from "@/app/router/customer-route";
import { GuestRoute } from "@/app/router/guest-route";
import { StorefrontLayout } from "@/components/layout/storefront-layout";

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
import { CheckoutPage } from "@/features/checkout/pages/checkout-page";

import { AccountLayout } from "@/features/account/layouts/account-layout";
import { AccountPage } from "@/features/account/pages/account-page";
import { AccountSectionPlaceholder } from "@/features/account/pages/account-section-placeholder";

function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route element={<CustomerRoute />}>
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountPage />} />

            <Route
              path="orders"
              element={
                <AccountSectionPlaceholder
                  eyebrow="Orders"
                  title="Your orders."
                  description="Order history will be connected to the backend in Part 39."
                />
              }
            />

            <Route
              path="returns"
              element={
                <AccountSectionPlaceholder
                  eyebrow="Returns"
                  title="Your returns."
                  description="Return history will be connected in the upcoming customer account parts."
                />
              }
            />

            <Route
              path="replacements"
              element={
                <AccountSectionPlaceholder
                  eyebrow="Replacements"
                  title="Your replacements."
                  description="Replacement history will be connected in the upcoming customer account parts."
                />
              }
            />
          </Route>
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
