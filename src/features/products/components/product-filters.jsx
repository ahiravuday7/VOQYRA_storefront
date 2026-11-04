import { toast } from "sonner";

import { Button } from "@/components/ui/button";

function ProductFilters({
  params,
  categories = [],
  brands = [],
  collections = [],
  updateParams,
  clearParams,
}) {
  const handlePriceSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const minimumValue = String(formData.get("minPrice") ?? "").trim();

    const maximumValue = String(formData.get("maxPrice") ?? "").trim();

    const minPrice = minimumValue === "" ? undefined : Number(minimumValue);

    const maxPrice = maximumValue === "" ? undefined : Number(maximumValue);

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      toast.error("Minimum price cannot be greater than maximum price.");

      return;
    }

    updateParams({
      minPrice,
      maxPrice,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>

        <button
          type="button"
          onClick={clearParams}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-coral hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <section>
        <label htmlFor="category-filter" className="mb-3 block text-sm font-semibold">
          Category
        </label>

        <select
          id="category-filter"
          value={params.category ?? ""}
          onChange={(event) =>
            updateParams({
              category: event.target.value || undefined,
            })
          }
          className="h-11 w-full rounded-md border border-cloud bg-white px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </section>

      {/* Brand */}
      <section>
        <label htmlFor="brand-filter" className="mb-3 block text-sm font-semibold">
          Brand
        </label>

        <select
          id="brand-filter"
          value={params.brand ?? ""}
          onChange={(event) =>
            updateParams({
              brand: event.target.value || undefined,
            })
          }
          className="h-11 w-full rounded-md border border-cloud bg-white px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All brands</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </section>

      {/* Collection */}
      <section>
        <label htmlFor="collection-filter" className="mb-3 block text-sm font-semibold">
          Collection
        </label>

        <select
          id="collection-filter"
          value={params.collection ?? ""}
          onChange={(event) =>
            updateParams({
              collection: event.target.value || undefined,
            })
          }
          className="h-11 w-full rounded-md border border-cloud bg-white px-3 text-sm outline-none focus:border-ink"
        >
          <option value="">All collections</option>

          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </section>

      {/* Price */}
      <section>
        <h3 className="mb-3 text-sm font-semibold">Price range</h3>

        <form
          key={`${params.minPrice ?? ""}-${params.maxPrice ?? ""}`}
          onSubmit={handlePriceSubmit}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="minPrice"
              min="0"
              defaultValue={params.minPrice ?? ""}
              placeholder="Min ₹"
              className="h-10 min-w-0 rounded-md border border-cloud bg-white px-3 text-sm outline-none focus:border-ink"
            />

            <input
              type="number"
              name="maxPrice"
              min="0"
              defaultValue={params.maxPrice ?? ""}
              placeholder="Max ₹"
              className="h-10 min-w-0 rounded-md border border-cloud bg-white px-3 text-sm outline-none focus:border-ink"
            />
          </div>

          <Button type="submit" variant="outline" className="w-full">
            Apply price
          </Button>
        </form>
      </section>

      {/* Product flags */}
      <section>
        <h3 className="mb-4 text-sm font-semibold">Shop by</h3>

        <div className="space-y-4">
          <FilterCheckbox
            label="In stock only"
            checked={Boolean(params.inStock)}
            onChange={(checked) =>
              updateParams({
                inStock: checked || undefined,
              })
            }
          />

          <FilterCheckbox
            label="New arrivals"
            checked={Boolean(params.isNewArrival)}
            onChange={(checked) =>
              updateParams({
                isNewArrival: checked || undefined,
              })
            }
          />

          <FilterCheckbox
            label="Best sellers"
            checked={Boolean(params.isBestSeller)}
            onChange={(checked) =>
              updateParams({
                isBestSeller: checked || undefined,
              })
            }
          />

          <FilterCheckbox
            label="Featured"
            checked={Boolean(params.isFeatured)}
            onChange={(checked) =>
              updateParams({
                isFeatured: checked || undefined,
              })
            }
          />
        </div>
      </section>
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 rounded border-cloud accent-ink"
      />

      <span>{label}</span>
    </label>
  );
}

export { ProductFilters };
