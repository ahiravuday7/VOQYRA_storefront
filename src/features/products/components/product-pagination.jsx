import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

function ProductPagination({ pagination, updateParams }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page) => {
    updateParams({
      page,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav className="mt-14 flex items-center justify-center gap-4" aria-label="Product pagination">
      <Button
        type="button"
        variant="outline"
        disabled={!pagination.hasPreviousPage}
        onClick={() => handlePageChange(pagination.page - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Previous
      </Button>

      <span className="text-sm text-slate">
        Page <strong className="text-ink">{pagination.page}</strong> of{" "}
        <strong className="text-ink">{pagination.totalPages}</strong>
      </span>

      <Button
        type="button"
        variant="outline"
        disabled={!pagination.hasNextPage}
        onClick={() => handlePageChange(pagination.page + 1)}
      >
        Next
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}

export { ProductPagination };
