import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full rounded-lg" />

      <Skeleton className="mt-4 h-3 w-24" />

      <Skeleton className="mt-3 h-5 w-4/5" />

      <Skeleton className="mt-2 h-4 w-1/2" />

      <Skeleton className="mt-4 h-5 w-24" />
    </div>
  );
}

function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {Array.from({
        length: count,
      }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export { ProductCardSkeleton, ProductGridSkeleton };
