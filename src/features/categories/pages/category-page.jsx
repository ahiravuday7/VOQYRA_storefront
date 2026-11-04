import { useParams } from "react-router-dom";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { CategoryCard } from "@/features/categories/components/category-card";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useCategory } from "@/features/categories/hooks/use-category";

function CategoryPage() {
  const { slug } = useParams();

  const categoryQuery = useCategory(slug);

  const category = categoryQuery.data;

  const childrenQuery = useCategories(
    {
      parent: category?.id,
    },
    {
      enabled: Boolean(category?.id),
    },
  );

  if (categoryQuery.isPending) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <LoadingSkeleton rows={4} />
        </PageContainer>
      </main>
    );
  }

  if (categoryQuery.isError) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <ErrorState
            title="Category unavailable."
            description={categoryQuery.error?.message ?? "We couldn't load this category."}
            onRetry={() => categoryQuery.refetch()}
          />
        </PageContainer>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen py-12">
        <PageContainer>
          <EmptyState
            title="Category not found."
            description="The category you're looking for isn't available."
          />
        </PageContainer>
      </main>
    );
  }

  const heroImage = category.bannerImage?.url || category.image?.url || "";

  const heroAlt = category.bannerImage?.altText || category.image?.altText || category.name;

  const childCategories = childrenQuery.data ?? [];

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
              label: category.name,
            },
          ]}
        />

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">Category</p>

            <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              {category.name}
            </h1>

            {category.description && (
              <p className="mt-5 text-base leading-7 text-slate sm:text-lg">
                {category.description}
              </p>
            )}
          </div>

          <div className="aspect-[16/10] overflow-hidden rounded-lg bg-cloud/30">
            <ImageWithFallback
              src={heroImage}
              alt={heroAlt}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Explore</p>

            <h2 className="mt-2 font-display text-3xl font-semibold">Shop {category.name}</h2>
          </div>

          {childrenQuery.isPending && <LoadingSkeleton rows={3} />}

          {childrenQuery.isError && (
            <ErrorState
              title="Subcategories unavailable."
              description={childrenQuery.error?.message ?? "We couldn't load these categories."}
              onRetry={() => childrenQuery.refetch()}
            />
          )}

          {!childrenQuery.isPending && !childrenQuery.isError && childCategories.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {childCategories.map((childCategory) => (
                <CategoryCard key={childCategory.id} category={childCategory} />
              ))}
            </div>
          )}

          {!childrenQuery.isPending && !childrenQuery.isError && childCategories.length === 0 && (
            <EmptyState
              title={`Explore ${category.name}`}
              description="Products for this category will appear here when product catalog integration is connected."
            />
          )}
        </section>
      </PageContainer>
    </main>
  );
}

export { CategoryPage };
