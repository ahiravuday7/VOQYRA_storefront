import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

import { useBrands } from "@/features/brands/hooks/use-brands";
import { useCategoryTree } from "@/features/categories/hooks/use-category-tree";
import { useCollections } from "@/features/collections/hooks/use-collections";

import { ProductFilterSheet } from "@/features/products/components/product-filter-sheet";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductGridSkeleton } from "@/features/products/components/product-card-skeleton";
import { ProductPagination } from "@/features/products/components/product-pagination";
import { ProductSearchForm } from "@/features/products/components/product-search-form";
import { ProductSort } from "@/features/products/components/product-sort";

import { useProductListUrlState } from "@/features/products/hooks/use-product-list-url-state";
import { useProducts } from "@/features/products/hooks/use-products";

import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function getLeafCategories(categories = []) {
  return categories.flatMap((category) => {
    const children = category.children ?? [];

    if (children.length > 0) {
      return getLeafCategories(children);
    }

    return [category];
  });
}

function getActiveFilterCount(params) {
  const keys = [
    "category",
    "brand",
    "collection",
    "isFeatured",
    "isNewArrival",
    "isBestSeller",
    "inStock",
    "minPrice",
    "maxPrice",
  ];

  return keys.reduce((count, key) => (params[key] !== undefined ? count + 1 : count), 0);
}

function ShopPage() {
  const location = useLocation();

  const { params, updateParams, clearParams } = useProductListUrlState();

  const productsQuery = useProducts(params);

  const categoriesQuery = useCategoryTree();

  const brandsQuery = useBrands();

  const collectionsQuery = useCollections();

  const leafCategories = useMemo(
    () => getLeafCategories(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  );

  const products = productsQuery.data?.products ?? [];

  const pagination = productsQuery.data?.pagination;

  const brands = brandsQuery.data ?? [];

  const collections = collectionsQuery.data ?? [];

  const activeFilterCount = getActiveFilterCount(params);

  const isSearchPage = location.pathname === "/search";

  const pageTitle =
    isSearchPage && params.search
      ? `Search results for “${params.search}”`
      : isSearchPage
        ? "Search"
        : "Shop";

  const productCount = pagination?.totalItems ?? products.length;

  const openQuickShop = useStorefrontUiStore((state) => state.openQuickShop);

  return (
    <main className="min-h-screen py-10 sm:py-12">
      <PageContainer>
        <Breadcrumbs
          items={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: isSearchPage ? "Search" : "Shop",
            },
          ]}
        />

        {/* Header */}
        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Discover VOQYRA
          </p>

          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {pageTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate">
            Explore our latest clothing, collections and everyday essentials.
          </p>

          <div className="mt-8">
            <ProductSearchForm search={params.search} updateParams={updateParams} />
          </div>
        </section>

        {/* Toolbar */}
        <section className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-cloud py-4">
          <div className="flex items-center gap-4">
            <ProductFilterSheet
              params={params}
              categories={leafCategories}
              brands={brands}
              collections={collections}
              updateParams={updateParams}
              clearParams={clearParams}
              activeFilterCount={activeFilterCount}
            />

            <p className="text-sm text-slate">
              <strong className="text-ink">{productCount}</strong>{" "}
              {productCount === 1 ? "product" : "products"}
            </p>

            {productsQuery.isFetching && !productsQuery.isPending && (
              <span className="text-xs text-slate">Updating…</span>
            )}
          </div>

          <ProductSort value={params.sort} updateParams={updateParams} />
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <ProductFilters
                params={params}
                categories={leafCategories}
                brands={brands}
                collections={collections}
                updateParams={updateParams}
                clearParams={clearParams}
              />
            </div>
          </aside>

          {/* Results */}
          <section>
            {productsQuery.isPending && <ProductGridSkeleton count={8} />}

            {productsQuery.isError && (
              <ErrorState
                title="Products unavailable."
                description={
                  productsQuery.error?.message ?? "We couldn't load the product catalog."
                }
                onRetry={() => productsQuery.refetch()}
              />
            )}

            {productsQuery.isSuccess && products.length === 0 && (
              <div className="py-12">
                <EmptyState
                  title="No products found."
                  description="Try changing your search or filters."
                />

                <div className="mt-6 flex justify-center">
                  <Button type="button" variant="outline" onClick={clearParams}>
                    Clear filters
                  </Button>
                </div>
              </div>
            )}

            {productsQuery.isSuccess && products.length > 0 && (
              <>
                <ProductGrid
                  products={products}
                  onQuickShop={(product) => openQuickShop(product.slug)}
                />

                <ProductPagination pagination={pagination} updateParams={updateParams} />
              </>
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}

export { ShopPage };
