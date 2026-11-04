import { SlidersHorizontal } from "lucide-react";

import { ProductFilters } from "@/features/products/components/product-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";

function ProductFilterSheet({
  params,
  categories,
  brands,
  collections,
  updateParams,
  clearParams,
  activeFilterCount = 0,
}) {
  const isOpen = useStorefrontUiStore((state) => state.isProductFilterOpen);

  const setOpen = useStorefrontUiStore((state) => state.setProductFilterOpen);

  return (
    <>
      <Button type="button" variant="outline" className="lg:hidden" onClick={() => setOpen(true)}>
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filters
        {activeFilterCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
          <SheetHeader className="text-left">
            <SheetTitle>Filters</SheetTitle>

            <SheetDescription>Refine the products shown in the catalog.</SheetDescription>
          </SheetHeader>

          <div className="px-4 py-6">
            <ProductFilters
              params={params}
              categories={categories}
              brands={brands}
              collections={collections}
              updateParams={updateParams}
              clearParams={clearParams}
            />
          </div>

          <SheetFooter className="border-t border-cloud">
            <SheetClose asChild>
              <Button className="w-full">View products</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export { ProductFilterSheet };
