import { Link, useParams } from "react-router-dom";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/features/brands/hooks/use-brand";

function BrandPage() {
  const { slug } = useParams();

  const brandQuery = useBrand(slug);

  const brand = brandQuery.data;

  if (brandQuery.isPending) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <LoadingSkeleton rows={4} />
        </PageContainer>
      </main>
    );
  }

  if (brandQuery.isError) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <ErrorState
            title="Brand unavailable."
            description={brandQuery.error?.message ?? "We couldn't load this brand."}
            onRetry={() => brandQuery.refetch()}
          />
        </PageContainer>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <EmptyState
            title="Brand not found."
            description="The brand you're looking for isn't available."
          />
        </PageContainer>
      </main>
    );
  }

  const logoUrl = brand.logo?.url ?? "";

  const logoAlt = brand.logo?.altText || `${brand.name} logo`;

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
              to: "/brands",
            },
            {
              label: brand.name,
            },
          ]}
        />

        <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">Brand</p>

            <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              {brand.name}
            </h1>

            {brand.description && (
              <p className="mt-5 max-w-xl text-base leading-7 text-slate sm:text-lg">
                {brand.description}
              </p>
            )}

            <Button asChild className="mt-8">
              <Link to={`/shop?brand=${encodeURIComponent(brand.id)}`}>Shop {brand.name}</Link>
            </Button>
          </div>

          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-cloud bg-soft-white p-10">
            <ImageWithFallback
              src={logoUrl}
              alt={logoAlt}
              className="max-h-32 w-full object-contain"
            />
          </div>
        </section>

        <section className="mt-16">
          <EmptyState
            title={`Explore ${brand.name}`}
            description="Products for this brand will appear here when product catalog integration is connected."
          />
        </section>
      </PageContainer>
    </main>
  );
}

export { BrandPage };
