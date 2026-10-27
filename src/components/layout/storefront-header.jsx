import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/features/auth/store/auth-store";

function StorefrontHeader() {
  const openCartDrawer = useStorefrontUiStore((state) => state.openCartDrawer);
  const openSearch = useStorefrontUiStore((state) => state.openSearch);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const accountPath = isAuthenticated ? "/account" : "/login";

  return (
    <header className="sticky top-0 z-40 border-b border-cloud/80 bg-porcelain/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-md lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="bg-porcelain">
              <SheetHeader>
                <SheetTitle className="text-left text-sm font-semibold uppercase tracking-[0.24em]">
                  VOQYRA
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-4 pt-8">
                <SheetClose asChild>
                  <Link to="/" className="border-b border-cloud py-4 text-2xl font-semibold">
                    Home
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link to="/shop" className="border-b border-cloud py-4 text-2xl font-semibold">
                    Shop
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    to="/shop?sort=newest"
                    className="border-b border-cloud py-4 text-2xl font-semibold"
                  >
                    New Drop
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    to={accountPath}
                    className="border-b border-cloud py-4 text-2xl font-semibold"
                  >
                    Account
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-sm font-bold uppercase tracking-[0.3em]">
            VOQYRA
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link to="/shop" className="text-sm font-medium transition-colors hover:text-coral">
              Shop
            </Link>

            <Link
              to="/shop?sort=newest"
              className="text-sm font-medium transition-colors hover:text-coral"
            >
              New Drop
            </Link>

            <Link to="/" className="text-sm font-medium transition-colors hover:text-coral">
              Collections
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-ink/5"
            aria-label="Open search"
          >
            <Search className="size-5" />
          </button>

          <Link
            to={accountPath}
            className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-ink/5"
            aria-label={isAuthenticated ? "My account" : "Sign in"}
          >
            <UserRound className="size-5" />
          </Link>

          <Link
            to="/wishlist"
            className="hidden size-10 items-center justify-center rounded-md transition-colors hover:bg-ink/5 sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="size-5" />
          </Link>

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-ink/5"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-5" />

            <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-coral text-[10px] font-semibold text-white">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export { StorefrontHeader };
