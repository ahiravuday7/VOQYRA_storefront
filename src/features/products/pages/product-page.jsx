import { Link, useParams } from "react-router-dom";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";

import { ProductDetailsSections } from "@/features/products/components/product-details-sections";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductPurchasePanel } from "@/features/products/components/product-purchase-panel";
import { useProduct } from "@/features/products/hooks/use-product";
import { useWishlistManager } from "@/features/wishlist/hooks/use-wishlist-manager";
import { useTrackRecentlyViewed } from "@/features/recently-viewed/hooks/use-track-recently-viewed";
import { useCartManager } from "@/features/cart/hooks/use-cart-manager";

function ProductPage() {
  const { slug } = useParams();

  const productQuery = useProduct(slug);

  const product = productQuery.data;

  const { isPendingFor, toggleWishlist, wishlistedProductIds } = useWishlistManager();

  useTrackRecentlyViewed(product?.id);

  const { addMutation, addToCart } = useCartManager();

  if (productQuery.isPending) {
    return (
      <main className="min-h-screen py-10">
        <PageContainer>
          <LoadingSkeleton rows={8} />
        </PageContainer>
      </main>
    );
  }

  if (productQuery.isError) {
    return (
      <main className="min-h-screen py-10">
        <PageContainer>
          <ErrorState
            title="Product unavailable."
            description={productQuery.error?.message ?? "We couldn't load this product."}
            onRetry={() => productQuery.refetch()}
          />
        </PageContainer>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen py-10">
        <PageContainer>
          <EmptyState
            title="Product not found."
            description="The product you're looking for is unavailable."
          />
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Shop",
              to: "/shop",
            },
            product.category && {
              label: product.category.name,
              to: `/category/${product.category.slug}`,
            },
            {
              label: product.name,
            },
          ].filter(Boolean)}
        />

        <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-14">
          <div className="min-w-0">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="relative">
              <div className="mb-5 flex flex-wrap gap-2">
                {product.isNewArrival && (
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                    New
                  </span>
                )}

                {product.isBestSeller && (
                  <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
                    Best Seller
                  </span>
                )}

                {product.isFeatured && (
                  <span className="rounded-full bg-coral px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                    Featured
                  </span>
                )}
              </div>

              {product.brand && (
                <Link
                  to={`/brand/${product.brand.slug}`}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-slate hover:text-coral"
                >
                  {product.brand.name}
                </Link>
              )}

              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-4 leading-7 text-slate">{product.shortDescription}</p>
              )}
            </div>

            <div className="mt-8">
              <ProductPurchasePanel
                key={product.id}
                product={product}
                onAddToCart={({ variant, quantity }) =>
                  addToCart({
                    product,
                    variant,
                    quantity,
                  })
                }
                isAddToCartPending={addMutation.isPending}
                onWishlist={() => toggleWishlist(product)}
                isWishlisted={wishlistedProductIds.has(product.id)}
                isWishlistPending={isPendingFor(product.id)}
              />
            </div>

            <ProductDetailsSections product={product} />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

export { ProductPage };
