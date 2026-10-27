import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function SearchOverlay() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const isSearchOpen = useStorefrontUiStore((state) => state.isSearchOpen);

  const closeSearch = useStorefrontUiStore((state) => state.closeSearch);

  if (!isSearchOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    closeSearch();

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);

    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-porcelain">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-[0.3em]">VOQYRA</span>

          <button
            type="button"
            onClick={closeSearch}
            className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-ink/5"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center pt-20 sm:pt-28">
          <div className="w-full max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              Find your next piece
            </p>

            <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              What are you looking for?
            </h1>

            <form className="mt-10" onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate"
                    aria-hidden="true"
                  />

                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search shirts, jackets, collections..."
                    autoFocus
                    className="h-14 pl-12 text-base"
                    aria-label="Search products"
                  />
                </div>

                <Button type="submit" className="h-14 px-7" disabled={!query.trim()}>
                  Search
                </Button>
              </div>
            </form>

            <div className="mt-10 border-t border-cloud pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                Popular searches
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Oversized shirts", "Black", "New Drop", "Jackets"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-cloud px-4 py-2 text-sm transition-colors hover:border-ink"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SearchOverlay };
