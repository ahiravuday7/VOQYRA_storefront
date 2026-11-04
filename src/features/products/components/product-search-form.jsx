import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ProductSearchForm({ search, updateParams }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const value = String(formData.get("search") ?? "").trim();

    updateParams({
      search: value || undefined,
    });
  };

  return (
    <form key={search ?? ""} onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate"
          aria-hidden="true"
        />

        <Input
          name="search"
          defaultValue={search ?? ""}
          placeholder="Search products..."
          className="pl-9"
          maxLength={100}
        />
      </div>

      <Button type="submit">Search</Button>

      {search && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            updateParams({
              search: undefined,
            })
          }
          aria-label="Clear search"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      )}
    </form>
  );
}

export { ProductSearchForm };
