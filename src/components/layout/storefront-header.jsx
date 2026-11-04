import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useCategoryTree } from "@/features/categories/hooks/use-category-tree";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function StorefrontHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const openCartDrawer = useStorefrontUiStore((state) => state.openCartDrawer);

  const openSearch = useStorefrontUiStore((state) => state.openSearch);

  const accountPath = isAuthenticated ? "/account" : "/login";

  const rootCategoriesQuery = useCategories({
    parent: "root",
  });

  const categoryTreeQuery = useCategoryTree();

  const rootCategories = rootCategoriesQuery.data ?? [];

  const categoryTree = categoryTreeQuery.data ?? [];

  return (
    <header className="sticky top-0 z-40 border-b border-cloud/80 bg-porcelain/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-8">
          {/* Mobile navigation */}
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

                {/* Real category tree from backend */}
                {categoryTree.map((category) => (
                  <div key={category.id} className="border-b border-cloud">
                    <SheetClose asChild>
                      <Link
                        to={`/category/${category.slug}`}
                        className="block py-4 text-2xl font-semibold"
                      >
                        {category.name}
                      </Link>
                    </SheetClose>

                    {category.children?.length > 0 && (
                      <div className="pb-4 pl-4">
                        {category.children.map((childCategory) => (
                          <SheetClose key={childCategory.id} asChild>
                            <Link
                              to={`/category/${childCategory.slug}`}
                              className="block py-2 text-sm text-slate transition-colors hover:text-ink"
                            >
                              {childCategory.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

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

          {/* Logo */}
          <Link to="/" className="text-sm font-bold uppercase tracking-[0.3em]">
            VOQYRA
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link to="/shop" className="text-sm font-medium transition-colors hover:text-coral">
              Shop
            </Link>

            {rootCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-sm font-medium transition-colors hover:text-coral"
              >
                {category.name}
              </Link>
            ))}

            <Link
              to="/shop?sort=newest"
              className="text-sm font-medium transition-colors hover:text-coral"
            >
              New Drop
            </Link>
          </nav>
        </div>

        {/* Header actions */}
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
