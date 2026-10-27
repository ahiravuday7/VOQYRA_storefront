import { Skeleton } from "@/components/ui/skeleton";

function LoadingSkeleton({ rows = 3, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}

export { LoadingSkeleton };
