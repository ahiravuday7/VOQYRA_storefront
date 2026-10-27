import { Navigate, Route, Routes } from "react-router-dom";

import { CustomerRoute } from "@/app/router/customer-route";
import { GuestRoute } from "@/app/router/guest-route";
import { Button } from "@/components/ui/button";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { PageContainer } from "@/components/common/page-container";
import { useSearchParams } from "react-router-dom";

function HomePage() {
  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-16 max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-coral">
            VOQYRA / Design System
          </p>

          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
            Fashion,
            <br />
            without the ordinary.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-slate sm:text-lg">
            A bold editorial commerce experience built around strong typography, expressive color,
            generous space, and purposeful interaction.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              className="h-auto rounded-md px-6 py-3.5 text-base font-semibold transition-transform duration-300 ease-brand hover:-translate-y-0.5"
            >
              Shop the drop
            </Button>

            <button
              type="button"
              className="rounded-md border border-ink bg-transparent px-6 py-3.5 font-semibold text-ink transition-colors duration-300 ease-brand hover:bg-ink hover:text-white"
            >
              Explore collection
            </button>
          </div>
        </div>

        <section aria-labelledby="color-system" className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                Foundation
              </p>

              <h2 id="color-system" className="mt-2 text-2xl font-semibold tracking-tight">
                Color system
              </h2>
            </div>

            <span className="hidden text-sm text-slate sm:block">Neo Editorial Commerce</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="overflow-hidden rounded-lg bg-ink shadow-soft">
              <div className="h-44" />

              <div className="bg-soft-white p-5">
                <p className="font-semibold">Deep Ink</p>
                <p className="mt-1 text-sm text-slate">#11131A</p>
              </div>
            </article>

            <article className="overflow-hidden rounded-lg border border-cloud bg-porcelain shadow-soft">
              <div className="h-44" />

              <div className="border-t border-cloud bg-soft-white p-5">
                <p className="font-semibold">Warm Porcelain</p>
                <p className="mt-1 text-sm text-slate">#F7F3ED</p>
              </div>
            </article>

            <article className="overflow-hidden rounded-lg bg-coral shadow-soft">
              <div className="h-44" />

              <div className="bg-soft-white p-5">
                <p className="font-semibold">Electric Coral</p>
                <p className="mt-1 text-sm text-slate">#FF5D5D</p>
              </div>
            </article>

            <article className="overflow-hidden rounded-lg bg-mint shadow-soft">
              <div className="h-44" />

              <div className="bg-soft-white p-5">
                <p className="font-semibold">Ice Mint</p>
                <p className="mt-1 text-sm text-slate">#B9F4D0</p>
              </div>
            </article>
          </div>
        </section>

        <section
          aria-labelledby="surface-system"
          className="grid gap-5 border-t border-cloud pt-10 lg:grid-cols-3"
        >
          <article className="rounded-lg bg-soft-white p-7 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">01</p>

            <h2 id="surface-system" className="mt-8 text-2xl font-semibold">
              Soft surface
            </h2>

            <p className="mt-3 leading-7 text-slate">
              Quiet surfaces keep product photography and editorial content in focus.
            </p>
          </article>

          <article className="rounded-xl bg-mint p-7 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">02</p>

            <h2 className="mt-8 text-2xl font-semibold">Expressive accent</h2>

            <p className="mt-3 leading-7 text-ink/70">
              Accent colors create moments of personality without overwhelming the experience.
            </p>
          </article>

          <article className="rounded-2xl bg-ink p-7 text-white shadow-float">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">03</p>

            <h2 className="mt-8 text-2xl font-semibold">Editorial contrast</h2>

            <p className="mt-3 leading-7 text-white/65">
              Deep contrast gives campaigns, launches, and premium collections stronger visual
              impact.
            </p>
          </article>
        </section>

        <footer className="mt-20 border-t border-cloud pt-6 text-sm text-slate">
          VOQYRA — Storefront design foundation
        </footer>
      </section>
    </main>
  );
}

function AccountPlaceholder() {
  return (
    <main className="min-h-screen py-12">
      <PageContainer>
        <h1 className="font-display text-4xl font-semibold">My Account</h1>

        <p className="mt-3 text-slate">Customer account area is protected successfully.</p>
      </PageContainer>
    </main>
  );
}

function SearchPlaceholder() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";

  return (
    <main className="min-h-screen py-12">
      <PageContainer>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Search</p>

        <h1 className="mt-3 font-display text-4xl font-semibold">Results for “{query}”</h1>

        <p className="mt-4 text-slate">
          Product search integration will be added in the public catalog phase.
        </p>
      </PageContainer>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPlaceholder />} />

        <Route element={<CustomerRoute />}>
          <Route path="/account" element={<AccountPlaceholder />} />
        </Route>
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
