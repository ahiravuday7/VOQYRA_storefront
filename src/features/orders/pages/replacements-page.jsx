import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useReplacements } from "@/features/orders/hooks/use-replacements";

const REPLACEMENT_STATUS_OPTIONS = [
  {
    value: "all",
    label: "All replacements",
  },
  {
    value: "reserved",
    label: "Reserved",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
  {
    value: "failed",
    label: "Failed",
  },
];

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
  {
    value: "number",
    label: "Replacement number",
  },
];

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getSortParams(sort) {
  switch (sort) {
    case "oldest":
      return {
        sortBy: "createdAt",
        sortDirection: "asc",
      };

    case "number":
      return {
        sortBy: "replacementNumber",
        sortDirection: "asc",
      };

    default:
      return {
        sortBy: "createdAt",
        sortDirection: "desc",
      };
  }
}

function ReplacementsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const status = searchParams.get("status") ?? "all";

  const search = searchParams.get("search") ?? "";

  const sort = searchParams.get("sort") ?? "newest";

  const sortParams = getSortParams(sort);

  const queryParams = {
    page,
    limit: 10,

    ...(status !== "all"
      ? {
          status,
        }
      : {}),

    ...(search
      ? {
          search,
        }
      : {}),

    ...sortParams,
  };

  const replacementsQuery = useReplacements(queryParams);

  const replacements = replacementsQuery.data?.replacements ?? [];

  const pagination = replacementsQuery.data?.pagination;

  const updateSearchParams = (updates) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "all" ||
        (key === "sort" && value === "newest")
      ) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    setSearchParams(next);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const value = String(formData.get("search") ?? "").trim();

    updateSearchParams({
      search: value,
      page: 1,
    });
  };

  const hasFilters = status !== "all" || Boolean(search);

  return (
    <div>
      <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Replacements
            </p>

            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
              Your replacements.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
              Track replacement preparation, shipment and delivery from your completed return
              requests.
            </p>
          </div>

          {pagination && (
            <p className="text-sm text-slate">
              {pagination.total} {pagination.total === 1 ? "replacement" : "replacements"}
            </p>
          )}
        </div>

        <form onSubmit={handleSearch} className="mt-7 flex gap-2 border-t border-cloud pt-5">
          <Input
            key={search}
            name="search"
            defaultValue={search}
            placeholder="Search replacement, return or order number"
          />

          <Button type="submit" variant="outline">
            <Search className="size-4" aria-hidden="true" />
            Search
          </Button>
        </form>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Select
            value={status}
            onValueChange={(value) =>
              updateSearchParams({
                status: value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Replacement status" />
            </SelectTrigger>

            <SelectContent>
              {REPLACEMENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) =>
              updateSearchParams({
                sort: value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Sort replacements" />
            </SelectTrigger>

            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="mt-6">
        {replacementsQuery.isPending && (
          <LoadingSkeleton rows={4} className="rounded-2xl border border-cloud bg-soft-white p-5" />
        )}

        {replacementsQuery.isError && (
          <div className="rounded-2xl border border-cloud bg-soft-white">
            <ErrorState
              title="We couldn't load your replacements."
              description={replacementsQuery.error?.message ?? "Please try again."}
              onRetry={() => replacementsQuery.refetch()}
            />
          </div>
        )}

        {replacementsQuery.isSuccess && replacements.length === 0 && (
          <div className="rounded-2xl bg-soft-white">
            <EmptyState
              title="No replacements found."
              description={
                hasFilters
                  ? "No replacements match the selected filters."
                  : "Approved replacement outcomes from your returns will appear here."
              }
              action={
                hasFilters ? (
                  <Button type="button" variant="outline" onClick={() => setSearchParams({})}>
                    Clear filters
                  </Button>
                ) : (
                  <Button asChild variant="outline">
                    <Link to="/account/returns">View returns</Link>
                  </Button>
                )
              }
            />
          </div>
        )}

        {replacementsQuery.isSuccess && replacements.length > 0 && (
          <div className="space-y-4">
            {replacements.map((replacement) => (
              <article
                key={replacement.id}
                className="rounded-2xl border border-cloud bg-soft-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{replacement.replacementNumber}</p>

                      <StatusBadge status={replacement.status} />
                    </div>

                    <p className="mt-2 text-xs text-slate">
                      Created {formatDate(replacement.createdAt)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate">Quantity</p>

                    <p className="mt-1 text-lg font-semibold">
                      {replacement.totalReplacementQuantity ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-cloud pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate">Order</p>

                    <p className="mt-1 text-sm font-semibold">{replacement.orderNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate">Return</p>

                    <p className="mt-1 text-sm font-semibold">{replacement.returnRequestNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate">Products</p>

                    <p className="mt-1 text-sm font-semibold">{replacement.itemCount ?? 0}</p>
                  </div>
                </div>

                {replacement.shippedAt && (
                  <p className="mt-4 text-xs text-slate">
                    Shipped {formatDate(replacement.shippedAt)}
                  </p>
                )}

                {replacement.deliveredAt && (
                  <p className="mt-2 text-xs font-medium text-slate">
                    Delivered {formatDate(replacement.deliveredAt)}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-cloud pt-5">
                  {replacement.returnRequestId && (
                    <Button asChild variant="ghost">
                      <Link to={`/account/returns/${replacement.returnRequestId}`}>
                        View return
                      </Link>
                    </Button>
                  )}

                  <Button asChild variant="outline">
                    <Link to={`/account/replacements/${replacement.id}`}>View replacement</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {replacementsQuery.isSuccess && pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-cloud bg-soft-white p-4">
          <Button
            type="button"
            variant="outline"
            disabled={!pagination.hasPreviousPage || replacementsQuery.isFetching}
            onClick={() =>
              updateSearchParams({
                page: pagination.page - 1,
              })
            }
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>

          <p className="text-sm text-slate">
            Page <span className="font-semibold text-ink">{pagination.page}</span> of{" "}
            <span className="font-semibold text-ink">{pagination.totalPages}</span>
          </p>

          <Button
            type="button"
            variant="outline"
            disabled={!pagination.hasNextPage || replacementsQuery.isFetching}
            onClick={() =>
              updateSearchParams({
                page: pagination.page + 1,
              })
            }
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}

export { ReplacementsPage };
