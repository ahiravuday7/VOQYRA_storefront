import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { StatusBadge } from "@/components/common/status-badge";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useReturnRequests } from "@/features/orders/hooks/use-return-requests";

const RETURN_STATUS_OPTIONS = [
  {
    value: "all",
    label: "All returns",
  },
  {
    value: "requested",
    label: "Requested",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "in-transit",
    label: "In transit",
  },
  {
    value: "received",
    label: "Received",
  },
  {
    value: "inspected",
    label: "Inspected",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

const RESOLUTION_OPTIONS = [
  {
    value: "all",
    label: "All resolutions",
  },
  {
    value: "refund",
    label: "Refund",
  },
  {
    value: "replacement",
    label: "Replacement",
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
];

function formatReturnDate(value) {
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

function formatResolution(resolution) {
  if (resolution === "refund") {
    return "Refund";
  }

  if (resolution === "replacement") {
    return "Replacement";
  }

  return resolution ?? "Unavailable";
}

function ReturnsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const status = searchParams.get("status") ?? "all";

  const resolution = searchParams.get("resolution") ?? "all";

  const sort = searchParams.get("sort") ?? "newest";

  const queryParams = {
    page,
    limit: 10,

    ...(status !== "all"
      ? {
          status,
        }
      : {}),

    ...(resolution !== "all"
      ? {
          requestedResolution: resolution,
        }
      : {}),

    sortDirection: sort === "oldest" ? "asc" : "desc",
  };

  const returnsQuery = useReturnRequests(queryParams);

  const returnRequests = returnsQuery.data?.returnRequests ?? [];

  const pagination = returnsQuery.data?.pagination;

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

  return (
    <div>
      <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Returns</p>

            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
              Your returns.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
              Follow your return requests from submission through inspection and final outcome.
            </p>
          </div>

          {pagination && (
            <p className="text-sm text-slate">
              {pagination.total} {pagination.total === 1 ? "return" : "returns"}
            </p>
          )}
        </div>

        <div className="mt-7 grid gap-3 border-t border-cloud pt-5 sm:grid-cols-3">
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
              <SelectValue placeholder="Return status" />
            </SelectTrigger>

            <SelectContent>
              {RETURN_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={resolution}
            onValueChange={(value) =>
              updateSearchParams({
                resolution: value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Resolution" />
            </SelectTrigger>

            <SelectContent>
              {RESOLUTION_OPTIONS.map((option) => (
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
              <SelectValue placeholder="Sort returns" />
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
      </div>

      <div className="mt-6">
        {returnsQuery.isPending && (
          <LoadingSkeleton rows={4} className="rounded-2xl border border-cloud bg-soft-white p-5" />
        )}

        {returnsQuery.isError && (
          <div className="rounded-2xl border border-cloud bg-soft-white">
            <ErrorState
              title="We couldn't load your returns."
              description={returnsQuery.error?.message ?? "Please try again."}
              onRetry={() => returnsQuery.refetch()}
            />
          </div>
        )}

        {returnsQuery.isSuccess && returnRequests.length === 0 && (
          <div className="rounded-2xl bg-soft-white">
            <EmptyState
              title="No returns found."
              description={
                status !== "all" || resolution !== "all"
                  ? "No return requests match the selected filters."
                  : "Return requests created from eligible delivered orders will appear here."
              }
              action={
                status === "all" && resolution === "all" ? (
                  <Button asChild variant="outline">
                    <Link to="/account/orders">View orders</Link>
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setSearchParams({})}>
                    Clear filters
                  </Button>
                )
              }
            />
          </div>
        )}

        {returnsQuery.isSuccess && returnRequests.length > 0 && (
          <div className="space-y-4">
            {returnRequests.map((returnRequest) => (
              <article
                key={returnRequest.id}
                className="rounded-2xl border border-cloud bg-soft-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{returnRequest.returnRequestNumber}</p>

                      <StatusBadge status={returnRequest.status} />
                    </div>

                    <p className="mt-2 text-xs text-slate">
                      Requested {formatReturnDate(returnRequest.createdAt)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate">Resolution</p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatResolution(returnRequest.requestedResolution)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-cloud pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate">Order</p>

                    <p className="mt-1 text-sm font-semibold">{returnRequest.orderNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate">Products</p>

                    <p className="mt-1 text-sm font-semibold">{returnRequest.itemCount}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate">Quantity</p>

                    <p className="mt-1 text-sm font-semibold">{returnRequest.totalQuantity}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-cloud pt-5">
                  <Button asChild variant="ghost">
                    <Link to={`/account/orders/${returnRequest.orderId}`}>View order</Link>
                  </Button>

                  <Button asChild variant="outline">
                    <Link to={`/account/returns/${returnRequest.id}`}>View return</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {returnsQuery.isSuccess && pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-cloud bg-soft-white p-4">
          <Button
            type="button"
            variant="outline"
            disabled={!pagination.hasPreviousPage || returnsQuery.isFetching}
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
            disabled={!pagination.hasNextPage || returnsQuery.isFetching}
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

export { ReturnsPage };
