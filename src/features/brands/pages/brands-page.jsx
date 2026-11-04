import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { BrandCard } from "@/features/brands/components/brand-card";
import { useBrands } from "@/features/brands/hooks/use-brands";

function BrandsPage() {
  const brandsQuery = useBrands();

  const brands = brandsQuery.data ?? [];

  if (brandsQuery.isPending) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <LoadingSkeleton rows={4} />
        </PageContainer>
      </main>
    );
  }

  if (brandsQuery.isError) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <ErrorState
            title="Brands unavailable."
            description={brandsQuery.error?.message ?? "We couldn't load brands."}
            onRetry={() => brandsQuery.refetch()}
          />
        </PageContainer>
      </main>
    );
  }

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
              label: "Brands",
            },
          ]}
        />

        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Designers & labels
          </p>

          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Brands
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate">
            Explore the labels available across VOQYRA.
          </p>
        </section>

        <section className="mt-12">
          {brands.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No brands available."
              description="Brands will appear here when they become available."
            />
          )}
        </section>
      </PageContainer>
    </main>
  );
}

export { BrandsPage };
