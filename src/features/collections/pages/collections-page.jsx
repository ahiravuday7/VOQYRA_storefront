import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { CollectionCard } from "@/features/collections/components/collection-card";
import { useCollections } from "@/features/collections/hooks/use-collections";

function CollectionsPage() {
  const collectionsQuery = useCollections();

  const collections = collectionsQuery.data ?? [];

  if (collectionsQuery.isPending) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <LoadingSkeleton rows={4} />
        </PageContainer>
      </main>
    );
  }

  if (collectionsQuery.isError) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <ErrorState
            title="Collections unavailable."
            description={collectionsQuery.error?.message ?? "We couldn't load collections."}
            onRetry={() => collectionsQuery.refetch()}
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
              label: "Collections",
            },
          ]}
        />

        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Curated edits
          </p>

          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Collections
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate">
            Discover curated edits, seasonal stories and featured selections from VOQYRA.
          </p>
        </section>

        <section className="mt-12">
          {collections.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No collections available."
              description="Collections will appear here when they become available."
            />
          )}
        </section>
      </PageContainer>
    </main>
  );
}

export { CollectionsPage };
