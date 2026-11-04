import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { PageContainer } from "@/components/common/page-container";

import {
  BrandsSection,
  FeaturedCollectionsSection,
  ShopByCategorySection,
} from "@/features/home/components/home-catalog-sections";
import { EditorialHero } from "@/features/home/components/editorial-hero";
import { HomeProductSection } from "@/features/home/components/home-product-section";
import { RecentlyViewedSection } from "@/features/recently-viewed/components/recently-viewed-section";

const NEW_ARRIVAL_PARAMS = {
  page: 1,
  limit: 4,
  isNewArrival: true,
  sort: "newest",
};

const BEST_SELLER_PARAMS = {
  page: 1,
  limit: 4,
  isBestSeller: true,
  sort: "newest",
};

function HomePage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <EditorialHero />

      {/* Discovery navigation */}
      <section className="border-b border-cloud py-6">
        <PageContainer>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            <DiscoveryLink
              number="01"
              label="New arrivals"
              description="Fresh additions to the catalog."
              to="/shop?isNewArrival=true"
            />

            <DiscoveryLink
              number="02"
              label="Best sellers"
              description="The pieces customers keep coming back to."
              to="/shop?isBestSeller=true"
            />

            <DiscoveryLink
              number="03"
              label="Featured"
              description="Selected VOQYRA edits."
              to="/shop?isFeatured=true"
            />

            <DiscoveryLink
              number="04"
              label="Collections"
              description="Explore curated seasonal stories."
              to="/collections"
            />
          </div>
        </PageContainer>
      </section>

      {/* Real new-arrival products */}
      <HomeProductSection
        eyebrow="Just landed"
        title="New Drop"
        description="Fresh additions from the latest VOQYRA catalog."
        linkLabel="Shop new arrivals"
        linkTo="/shop?isNewArrival=true"
        params={NEW_ARRIVAL_PARAMS}
      />

      {/* Real featured collections */}
      <FeaturedCollectionsSection />

      {/* Real categories */}
      <ShopByCategorySection />

      {/* Real best-selling products */}
      <HomeProductSection
        eyebrow="Trending"
        title="Right now"
        description="Best-selling pieces from across the catalog."
        linkLabel="Shop best sellers"
        linkTo="/shop?isBestSeller=true"
        params={BEST_SELLER_PARAMS}
        className="border-t border-cloud"
      />

      {/* Customer browsing history */}
      <RecentlyViewedSection />

      {/* Real brands */}
      <BrandsSection />

      {/* Editorial brand story */}
      <section className="motion-reveal bg-ink py-20 text-white sm:py-28">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                The VOQYRA point of view
              </p>

              <p className="mt-5 text-sm leading-7 text-white/60">Neo Editorial Commerce</p>
            </div>

            <div>
              <h2 className="max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-7xl">
                Clothing should feel considered, not complicated.
              </h2>

              <div className="mt-8 flex flex-wrap gap-6">
                <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold">
                  Shop VOQYRA
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>

                <Link
                  to="/brands"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 hover:text-white"
                >
                  Explore brands
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}

function DiscoveryLink({ number, label, description, to }) {
  return (
    <Link
      to={to}
      className="group border-b border-cloud py-6 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate">{number}</span>

        <ArrowUpRight className="motion-icon size-4" aria-hidden="true" />
      </div>

      <h2 className="mt-8 text-xl font-semibold">{label}</h2>

      <p className="mt-2 text-sm leading-6 text-slate">{description}</p>
    </Link>
  );
}

export { HomePage };
