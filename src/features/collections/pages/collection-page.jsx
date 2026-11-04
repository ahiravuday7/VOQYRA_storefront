import { Link, useParams } from "react-router-dom";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/features/collections/hooks/use-collection";

function CollectionPage() {
  const { slug } = useParams();

  const collectionQuery = useCollection(slug);

  const collection = collectionQuery.data;

  if (collectionQuery.isPending) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <LoadingSkeleton rows={4} />
        </PageContainer>
      </main>
    );
  }

  if (collectionQuery.isError) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <ErrorState
            title="Collection unavailable."
            description={collectionQuery.error?.message ?? "We couldn't load this collection."}
            onRetry={() => collectionQuery.refetch()}
          />
        </PageContainer>
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <EmptyState
            title="Collection not found."
            description="The collection you're looking for isn't available."
          />
        </PageContainer>
      </main>
    );
  }

  const bannerUrl = collection.banner?.url ?? "";

  const bannerAlt = collection.banner?.altText || collection.name;

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
              label: "Collections",
              to: "/collections",
            },
            {
              label: collection.name,
            },
          ]}
        />

        <section className="mt-10">
          <div className="aspect-[16/7] overflow-hidden rounded-lg bg-cloud/30">
            <ImageWithFallback
              src={bannerUrl}
              alt={bannerAlt}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Collection
            </p>

            <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              {collection.name}
            </h1>

            {collection.description && (
              <p className="mt-5 text-base leading-7 text-slate sm:text-lg">
                {collection.description}
              </p>
            )}

            <Button asChild className="mt-8">
              <Link to={`/shop?collection=${encodeURIComponent(collection.id)}`}>
                Shop collection
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <EmptyState
            title={`Explore ${collection.name}`}
            description="Products from this collection will appear here when product catalog integration is connected."
          />
        </section>
      </PageContainer>
    </main>
  );
}

export { CollectionPage };
