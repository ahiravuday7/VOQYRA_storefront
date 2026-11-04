import { ErrorState } from "@/components/common/error-state";
import { PageContainer } from "@/components/common/page-container";

import { HomeSectionHeading } from "@/features/home/components/home-section-heading";
import { ProductGrid } from "@/features/products/components/product-grid";
import { useProducts } from "@/features/products/hooks/use-products";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/5] rounded-lg bg-cloud/60" />

          <div className="mt-4 h-3 w-20 rounded bg-cloud" />

          <div className="mt-3 h-5 w-4/5 rounded bg-cloud" />

          <div className="mt-3 h-4 w-24 rounded bg-cloud" />
        </div>
      ))}
    </div>
  );
}

function HomeProductSection({
  eyebrow,
  title,
  description,
  linkLabel,
  linkTo,
  params,
  className = "",
}) {
  const productsQuery = useProducts(params);

  const openQuickShop = useStorefrontUiStore((state) => state.openQuickShop);

  const products = productsQuery.data?.products ?? [];

  return (
    <section className={`motion-reveal py-20 sm:py-24 ${className}`}>
      <PageContainer>
        <HomeSectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          linkLabel={linkLabel}
          linkTo={linkTo}
        />

        {productsQuery.isPending && <ProductGridSkeleton />}

        {productsQuery.isError && (
          <ErrorState
            title="Products unavailable."
            description={productsQuery.error?.message ?? "We couldn't load these products."}
            onRetry={() => productsQuery.refetch()}
          />
        )}

        {!productsQuery.isPending && !productsQuery.isError && products.length === 0 && (
          <div className="rounded-lg border border-cloud px-6 py-12 text-center">
            <p className="text-sm text-slate">No products are available in this edit yet.</p>
          </div>
        )}

        {!productsQuery.isPending && !productsQuery.isError && products.length > 0 && (
          <ProductGrid products={products} onQuickShop={(product) => openQuickShop(product.slug)} />
        )}
      </PageContainer>
    </section>
  );
}

export { HomeProductSection };
