import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Currency } from "@/components/common/currency";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
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

import { useOrders } from "@/features/orders/hooks/use-orders";

const ORDER_STATUS_OPTIONS = [
  {
    value: "all",
    label: "All orders",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "confirmed",
    label: "Confirmed",
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
    value: "refunded",
    label: "Refunded",
  },
];

const PAYMENT_STATUS_OPTIONS = [
  {
    value: "all",
    label: "All payments",
  },
  {
    value: "pending",
    label: "Payment pending",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "failed",
    label: "Failed",
  },
  {
    value: "partially-refunded",
    label: "Partially refunded",
  },
  {
    value: "refunded",
    label: "Refunded",
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
    value: "total-high",
    label: "Highest total",
  },
  {
    value: "total-low",
    label: "Lowest total",
  },
];

function formatOrderDate(value) {
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

    case "total-high":
      return {
        sortBy: "grandTotal",
        sortDirection: "desc",
      };

    case "total-low":
      return {
        sortBy: "grandTotal",
        sortDirection: "asc",
      };

    default:
      return {
        sortBy: "createdAt",
        sortDirection: "desc",
      };
  }
}

function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const status = searchParams.get("status") ?? "all";

  const paymentStatus = searchParams.get("paymentStatus") ?? "all";

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

    ...(paymentStatus !== "all"
      ? {
          paymentStatus,
        }
      : {}),

    ...sortParams,
  };

  const ordersQuery = useOrders(queryParams);

  const orders = ordersQuery.data?.orders ?? [];

  const pagination = ordersQuery.data?.pagination;

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

  const handleStatusChange = (value) => {
    updateSearchParams({
      status: value,
      page: 1,
    });
  };

  const handlePaymentStatusChange = (value) => {
    updateSearchParams({
      paymentStatus: value,
      page: 1,
    });
  };

  const handleSortChange = (value) => {
    updateSearchParams({
      sort: value,
      page: 1,
    });
  };

  const handlePageChange = (nextPage) => {
    updateSearchParams({
      page: nextPage,
    });
  };

  return (
    <div>
      <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Orders</p>

            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
              Your orders.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate">
              Track your purchases, payment status and delivery progress.
            </p>
          </div>

          {pagination && (
            <p className="text-sm text-slate">
              {pagination.totalItems} {pagination.totalItems === 1 ? "order" : "orders"}
            </p>
          )}
        </div>

        <div className="mt-7 grid gap-3 border-t border-cloud pt-5 sm:grid-cols-3">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Order status" />
            </SelectTrigger>

            <SelectContent>
              {ORDER_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paymentStatus} onValueChange={handlePaymentStatusChange}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Payment status" />
            </SelectTrigger>

            <SelectContent>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Sort orders" />
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
        {ordersQuery.isPending && (
          <LoadingSkeleton rows={4} className="rounded-2xl border border-cloud bg-soft-white p-5" />
        )}

        {ordersQuery.isError && (
          <div className="rounded-2xl border border-cloud bg-soft-white">
            <ErrorState
              title="We couldn't load your orders."
              description={ordersQuery.error?.message ?? "Please try again."}
              onRetry={() => ordersQuery.refetch()}
            />
          </div>
        )}

        {ordersQuery.isSuccess && orders.length === 0 && (
          <div className="rounded-2xl bg-soft-white">
            <EmptyState
              title="No orders found."
              description={
                status !== "all" || paymentStatus !== "all"
                  ? "No orders match the selected filters."
                  : "When you place an order, it will appear here."
              }
              action={
                status === "all" && paymentStatus === "all" ? (
                  <Button asChild>
                    <Link to="/shop">Start shopping</Link>
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

        {ordersQuery.isSuccess && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items?.[0];

              const remainingItems = Math.max(
                (order.distinctItemCount ?? order.items?.length ?? 0) - 1,
                0,
              );

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-cloud bg-soft-white p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{order.orderNumber}</p>

                        <StatusBadge status={order.status} />
                      </div>

                      <p className="mt-2 text-xs text-slate">
                        Placed on {formatOrderDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate">Order total</p>

                      <Currency
                        value={order.totals?.grandTotal ?? 0}
                        currency={order.totals?.currency ?? "INR"}
                        className="mt-1 text-lg font-semibold"
                      />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-cloud pt-5">
                    {firstItem ? (
                      <div className="flex gap-4">
                        <ImageWithFallback
                          src={firstItem.image?.url}
                          alt={firstItem.image?.altText ?? firstItem.productName}
                          className="size-20 shrink-0 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{firstItem.productName}</p>

                          <p className="mt-1 text-xs text-slate">
                            {[
                              firstItem.size ? `Size ${firstItem.size}` : null,

                              firstItem.color?.name ?? null,

                              firstItem.quantity ? `Qty ${firstItem.quantity}` : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          {remainingItems > 0 && (
                            <p className="mt-2 text-xs font-medium text-slate">
                              +{remainingItems} more {remainingItems === 1 ? "item" : "items"}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-sm text-slate">
                        <PackageOpen className="size-5" />
                        Order items unavailable.
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-cloud pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate">Payment</p>

                      <div className="mt-1">
                        <StatusBadge status={order.payment?.status ?? "pending"} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate">Inventory</p>

                      <div className="mt-1">
                        <StatusBadge status={order.inventoryStatus} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate">Items</p>

                      <p className="mt-1 text-sm font-semibold">{order.totalQuantity ?? 0}</p>
                    </div>
                  </div>

                  <p className="mt-5 text-xs leading-5 text-slate">
                    Full order details, tracking, cancellation and timeline will be available in
                    Part 40.
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {ordersQuery.isSuccess && pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-cloud bg-soft-white p-4">
          <Button
            type="button"
            variant="outline"
            disabled={!pagination.hasPreviousPage || ordersQuery.isFetching}
            onClick={() => handlePageChange(pagination.page - 1)}
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
            disabled={!pagination.hasNextPage || ordersQuery.isFetching}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}

export { OrdersPage };
