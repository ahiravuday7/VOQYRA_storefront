import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { PageContainer } from "@/components/common/page-container";

import { useBrands } from "@/features/brands/hooks/use-brands";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useCollections } from "@/features/collections/hooks/use-collections";
import { HomeSectionHeading } from "@/features/home/components/home-section-heading";

function getList(data, key) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.[key])) {
    return data[key];
  }

  if (Array.isArray(data?.data?.[key])) {
    return data.data[key];
  }

  return [];
}

function SectionSkeleton({ count = 3 }) {
  return (
    <div
      className={`grid gap-5 ${count === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}
    >
      {Array.from({
        length: count,
      }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/5] rounded-lg bg-cloud/60" />
          <div className="mt-4 h-5 w-2/3 rounded bg-cloud" />
          <div className="mt-3 h-4 w-1/2 rounded bg-cloud" />
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------
   FEATURED COLLECTIONS
----------------------------------- */

function FeaturedCollectionsSection() {
  const collectionsQuery = useCollections({
    isFeatured: true,
  });

  const collections = getList(collectionsQuery.data, "collections").slice(0, 3);

  return (
    <section className="motion-reveal border-y border-cloud bg-soft-white py-20 sm:py-24">
      <PageContainer>
        <HomeSectionHeading
          eyebrow="Curated"
          title="Featured collections"
          description="Seasonal stories curated from the latest VOQYRA collections."
          linkLabel="All collections"
          linkTo="/collections"
        />

        {collectionsQuery.isPending && <SectionSkeleton />}

        {collectionsQuery.isError && (
          <SectionError
            message="We couldn't load featured collections."
            onRetry={() => collectionsQuery.refetch()}
          />
        )}

        {!collectionsQuery.isPending && !collectionsQuery.isError && collections.length === 0 && (
          <EmptySection message="No featured collections are available yet." />
        )}

        {collections.length > 0 && (
          <div className="grid gap-5 md:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collection/${collection.slug}`}
                className="group motion-card"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-lg bg-cloud/40">
                  <ImageWithFallback
                    src={collection.banner?.url ?? ""}
                    alt={collection.banner?.altText || collection.name}
                    className="motion-image h-full w-full object-cover"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                      Collection
                    </p>

                    <h3 className="mt-2 font-display text-2xl font-semibold">{collection.name}</h3>

                    {collection.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate">
                        {collection.description}
                      </p>
                    )}
                  </div>

                  <ArrowUpRight className="motion-icon mt-1 size-5 shrink-0" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}

/* ----------------------------------
   CATEGORIES
----------------------------------- */

function ShopByCategorySection() {
  const categoriesQuery = useCategories();

  const categories = getList(categoriesQuery.data, "categories").slice(0, 4);

  return (
    <section className="motion-reveal py-20 sm:py-24">
      <PageContainer>
        <HomeSectionHeading
          eyebrow="Discover"
          title="Shop by category"
          description="Find your next look through the categories available in the VOQYRA catalog."
          linkLabel="Shop everything"
          linkTo="/shop"
        />

        {categoriesQuery.isPending && <SectionSkeleton count={4} />}

        {categoriesQuery.isError && (
          <SectionError
            message="We couldn't load categories."
            onRetry={() => categoriesQuery.refetch()}
          />
        )}

        {!categoriesQuery.isPending && !categoriesQuery.isError && categories.length === 0 && (
          <EmptySection message="No categories are available yet." />
        )}

        {categories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={`group motion-card flex min-h-[280px] flex-col justify-between rounded-lg p-7 ${
                  index % 4 === 0
                    ? "bg-ink text-white"
                    : index % 4 === 1
                      ? "bg-mint"
                      : index % 4 === 2
                        ? "bg-coral text-white"
                        : "bg-cloud/60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      index === 0 || index === 2 ? "text-white/65" : "text-slate"
                    }`}
                  >
                    Category
                  </span>

                  <ArrowUpRight className="motion-icon size-5" aria-hidden="true" />
                </div>

                <div>
                  <h3 className="font-display text-4xl leading-none">{category.name}</h3>

                  {category.description && (
                    <p
                      className={`mt-4 line-clamp-2 text-sm leading-6 ${
                        index === 0 || index === 2 ? "text-white/70" : "text-slate"
                      }`}
                    >
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}

/* ----------------------------------
   BRANDS
----------------------------------- */

function BrandsSection() {
  const brandsQuery = useBrands();

  const brands = getList(brandsQuery.data, "brands").slice(0, 6);

  return (
    <section className="motion-reveal border-t border-cloud py-16 sm:py-20">
      <PageContainer>
        <HomeSectionHeading
          eyebrow="Labels"
          title="Brands to know"
          description="Explore brands currently available across the VOQYRA catalog."
          linkLabel="All brands"
          linkTo="/brands"
        />

        {brandsQuery.isPending && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-lg bg-cloud/60" />
            ))}
          </div>
        )}

        {brandsQuery.isError && (
          <SectionError message="We couldn't load brands." onRetry={() => brandsQuery.refetch()} />
        )}

        {!brandsQuery.isPending && !brandsQuery.isError && brands.length === 0 && (
          <EmptySection message="No brands are available yet." />
        )}

        {brands.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brand/${brand.slug}`}
                className="group motion-card flex min-h-32 flex-col items-center justify-center rounded-lg border border-cloud bg-white p-5 text-center hover:border-ink"
              >
                {brand.logo?.url && (
                  <div className="mb-4 h-10 w-full">
                    <ImageWithFallback
                      src={brand.logo.url}
                      alt={brand.logo.altText || brand.name}
                      className="motion-image h-full w-full object-contain"
                    />
                  </div>
                )}

                <span className="text-sm font-semibold">{brand.name}</span>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}

/* ----------------------------------
   SMALL SHARED STATES
----------------------------------- */

function SectionError({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-cloud px-6 py-10 text-center">
      <p className="text-sm text-slate">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 text-sm font-semibold underline underline-offset-4"
      >
        Try again
      </button>
    </div>
  );
}

function EmptySection({ message }) {
  return (
    <div className="rounded-lg border border-cloud px-6 py-10 text-center text-sm text-slate">
      {message}
    </div>
  );
}

export { BrandsSection, FeaturedCollectionsSection, ShopByCategorySection };
