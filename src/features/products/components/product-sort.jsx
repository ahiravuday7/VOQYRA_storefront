import { PRODUCT_SORT_OPTIONS } from "@/features/products/product.constants";

function ProductSort({ value, updateParams }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="product-sort" className="whitespace-nowrap text-sm text-slate">
        Sort by
      </label>

      <select
        id="product-sort"
        value={value}
        onChange={(event) =>
          updateParams({
            sort: event.target.value,
          })
        }
        className="h-10 rounded-md border border-cloud bg-white px-3 text-sm text-ink outline-none transition focus:border-ink"
      >
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { ProductSort };
