import { ArrowLeft, ExternalLink, PackageCheck, Truck, WalletCards } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Currency } from "@/components/common/currency";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";

import { ReturnRequestCancellation } from "@/features/orders/components/return-request-cancellation";
import { useReturnRequest } from "@/features/orders/hooks/use-return-request";

function formatDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatLabel(value) {
  if (!value) {
    return "Unavailable";
  }

  return String(value)
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getInspectionTime(items = []) {
  const timestamps = items
    .map((item) => item.inspection?.inspectedAt)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function buildTimeline(returnRequest) {
  const entries = [
    {
      status: "requested",
      label: "Return requested",
      at: returnRequest.createdAt,
    },

    {
      status: "approved",
      label: "Return approved",
      at: returnRequest.approval?.approvedAt,
    },

    {
      status: "rejected",
      label: "Return rejected",
      at: returnRequest.rejection?.rejectedAt,
    },

    {
      status: "in-transit",
      label: "Return in transit",
      at: returnRequest.shipment?.markedInTransitAt,
    },

    {
      status: "received",
      label: "Received at warehouse",
      at: returnRequest.receipt?.receivedAt,
    },

    {
      status: "inspected",
      label: "Inspection completed",
      at: getInspectionTime(returnRequest.items),
    },

    {
      status: "completed",
      label: "Return completed",
      at: returnRequest.completion?.completedAt,
    },

    {
      status: "cancelled",
      label: "Return cancelled",
      at: returnRequest.cancellation?.cancelledAt,
    },

    {
      status: "refunded",
      label: "Refund processed",
      at: returnRequest.refund?.refundedAt,
    },
  ]
    .filter((entry) => Boolean(entry.at))
    .sort((first, second) => new Date(first.at) - new Date(second.at));

  return entries;
}

function ReturnDetailsPage() {
  const { returnRequestId } = useParams();

  const returnQuery = useReturnRequest(returnRequestId);

  if (returnQuery.isPending) {
    return (
      <LoadingSkeleton rows={6} className="rounded-2xl border border-cloud bg-soft-white p-5" />
    );
  }

  if (returnQuery.isError) {
    const isNotFound = returnQuery.error?.code === "ORDER_RETURN_REQUEST_NOT_FOUND";

    return (
      <div className="rounded-2xl border border-cloud bg-soft-white">
        <ErrorState
          title={isNotFound ? "Return request not found." : "We couldn't load this return."}
          description={
            isNotFound
              ? "This return request could not be found in your account."
              : (returnQuery.error?.message ?? "Please try again.")
          }
          onRetry={isNotFound ? undefined : () => returnQuery.refetch()}
        />

        <div className="pb-8 text-center">
          <Button asChild variant="outline">
            <Link to="/account/returns">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to returns
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const returnRequest = returnQuery.data;

  const timeline = buildTimeline(returnRequest);

  const hasRefund =
    Boolean(returnRequest.refund?.refundedAt) || Number(returnRequest.refund?.amount ?? 0) > 0;

  return (
    <div>
      <Button asChild variant="ghost" className="-ml-3 mb-5">
        <Link to="/account/returns">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to returns
        </Link>
      </Button>

      {/* Header */}
      <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Return request
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">
                {returnRequest.returnRequestNumber}
              </h2>

              <StatusBadge status={returnRequest.status} />
            </div>

            <p className="mt-3 text-sm text-slate">
              Requested {formatDateTime(returnRequest.createdAt) ?? "date unavailable"}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-[0.12em] text-slate">Resolution</p>

            <p className="mt-1 text-lg font-semibold">
              {formatLabel(returnRequest.requestedResolution)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-cloud pt-6">
          <div>
            <p className="text-xs text-slate">Original order</p>

            <p className="mt-1 text-sm font-semibold">{returnRequest.orderNumber}</p>
          </div>

          <Button asChild variant="outline">
            <Link to={`/account/orders/${returnRequest.orderId}`}>View order</Link>
          </Button>
        </div>

        <ReturnRequestCancellation returnRequest={returnRequest} />
      </section>

      {/* Returned items */}
      <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <PackageCheck className="size-5" aria-hidden="true" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Returned items
            </p>

            <h3 className="mt-1 font-display text-2xl font-semibold">Items in this request.</h3>
          </div>
        </div>

        <div className="mt-6 divide-y divide-cloud border-y border-cloud">
          {(returnRequest.items ?? []).map((item) => (
            <article key={item.id} className="py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold">{item.productName}</p>

                  <p className="mt-1 text-xs text-slate">SKU: {item.sku}</p>

                  <p className="mt-2 text-sm text-slate">
                    {[
                      item.size ? `Size ${item.size}` : null,

                      item.color?.name ?? null,

                      `Qty ${item.quantity}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-slate">Reason</p>

                  <p className="mt-1 text-sm font-semibold">{formatLabel(item.reason)}</p>
                </div>
              </div>

              {item.details && (
                <p className="mt-4 rounded-lg bg-cloud/30 p-4 text-sm leading-6 text-slate">
                  {item.details}
                </p>
              )}

              <div className="mt-5 border-t border-cloud pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate">Inspection</p>

                    <div className="mt-2">
                      <StatusBadge status={item.inspection?.status ?? "pending"} />
                    </div>
                  </div>

                  {item.inspection?.inspectedAt && (
                    <p className="text-xs text-slate">
                      {formatDateTime(item.inspection.inspectedAt)}
                    </p>
                  )}
                </div>

                {item.inspection?.status === "inspected" && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-cloud/30 p-3">
                      <p className="text-xs text-slate">Resellable</p>

                      <p className="mt-1 font-semibold">{item.inspection.resellableQuantity}</p>
                    </div>

                    <div className="rounded-lg bg-cloud/30 p-3">
                      <p className="text-xs text-slate">Damaged</p>

                      <p className="mt-1 font-semibold">{item.inspection.damagedQuantity}</p>
                    </div>

                    <div className="rounded-lg bg-cloud/30 p-3">
                      <p className="text-xs text-slate">Rejected</p>

                      <p className="mt-1 font-semibold">{item.inspection.rejectedQuantity}</p>
                    </div>
                  </div>
                )}

                {item.inspection?.note && (
                  <p className="mt-4 text-sm leading-6 text-slate">{item.inspection.note}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Shipment */}
        <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Truck className="size-5" aria-hidden="true" />

            <h3 className="font-display text-2xl font-semibold">Return shipment.</h3>
          </div>

          {returnRequest.shipment?.markedInTransitAt ? (
            <div className="mt-6 divide-y divide-cloud border-y border-cloud">
              {returnRequest.shipment?.carrier && (
                <div className="flex justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Carrier</span>

                  <span className="text-sm font-semibold">{returnRequest.shipment.carrier}</span>
                </div>
              )}

              {returnRequest.shipment?.trackingNumber && (
                <div className="flex justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Tracking number</span>

                  <span className="text-sm font-semibold">
                    {returnRequest.shipment.trackingNumber}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 py-4">
                <span className="text-sm text-slate">In transit</span>

                <span className="text-right text-sm font-semibold">
                  {formatDateTime(returnRequest.shipment.markedInTransitAt)}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-slate">
              Shipment details have not been added yet.
            </p>
          )}

          {returnRequest.shipment?.trackingUrl && (
            <Button asChild variant="outline" className="mt-5">
              <a href={returnRequest.shipment.trackingUrl} target="_blank" rel="noreferrer">
                Track return
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </Button>
          )}
        </section>

        {/* Refund */}
        <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <WalletCards className="size-5" aria-hidden="true" />

            <h3 className="font-display text-2xl font-semibold">Refund.</h3>
          </div>

          {hasRefund ? (
            <div className="mt-6 divide-y divide-cloud border-y border-cloud">
              <div className="flex justify-between gap-4 py-4">
                <span className="text-sm text-slate">Amount</span>

                <Currency
                  value={returnRequest.refund?.amount ?? 0}
                  currency={returnRequest.refund?.currency ?? "INR"}
                  className="font-semibold"
                />
              </div>

              <div className="flex justify-between gap-4 py-4">
                <span className="text-sm text-slate">Refunded quantity</span>

                <span className="font-semibold">{returnRequest.refund?.refundedQuantity}</span>
              </div>

              {returnRequest.refund?.referenceId && (
                <div className="flex justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Reference</span>

                  <span className="break-all text-right text-sm font-semibold">
                    {returnRequest.refund.referenceId}
                  </span>
                </div>
              )}

              {returnRequest.refund?.refundedAt && (
                <div className="flex justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Refunded</span>

                  <span className="text-right text-sm font-semibold">
                    {formatDateTime(returnRequest.refund.refundedAt)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-slate">
              No Return refund has been recorded yet.
            </p>
          )}
        </section>
      </div>

      {/* Timeline */}
      <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Timeline</p>

        <h3 className="mt-2 font-display text-2xl font-semibold">Return progress.</h3>

        <ol className="mt-7">
          {timeline.map((entry, index) => {
            const isLast = index === timeline.length - 1;

            return (
              <li key={`${entry.status}-${entry.at}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="mt-1 size-3 rounded-full bg-ink" />

                  {!isLast && <div className="min-h-16 w-px flex-1 bg-cloud" />}
                </div>

                <div className="pb-7">
                  <p className="text-sm font-semibold">{entry.label}</p>

                  <div className="mt-2">
                    <StatusBadge status={entry.status} />
                  </div>

                  <p className="mt-2 text-xs text-slate">{formatDateTime(entry.at)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Notes and outcomes */}
      {(returnRequest.customerNote ||
        returnRequest.rejection?.rejectedAt ||
        returnRequest.cancellation?.cancelledAt) && (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {returnRequest.customerNote && (
            <section className="rounded-2xl border border-cloud bg-soft-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Your note
              </p>

              <p className="mt-3 text-sm leading-7">{returnRequest.customerNote}</p>
            </section>
          )}

          {returnRequest.rejection?.rejectedAt && (
            <section className="rounded-2xl border border-cloud bg-soft-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Rejection
              </p>

              <p className="mt-3 font-semibold">Return rejected</p>

              <p className="mt-1 text-xs text-slate">
                {formatDateTime(returnRequest.rejection.rejectedAt)}
              </p>

              {returnRequest.rejection?.reason && (
                <p className="mt-3 text-sm leading-6 text-slate">
                  {returnRequest.rejection.reason}
                </p>
              )}
            </section>
          )}

          {returnRequest.cancellation?.cancelledAt && (
            <section className="rounded-2xl border border-cloud bg-soft-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Cancellation
              </p>

              <p className="mt-3 font-semibold">Return cancelled</p>

              <p className="mt-1 text-xs text-slate">
                {formatDateTime(returnRequest.cancellation.cancelledAt)}
              </p>

              {returnRequest.cancellation?.reason && (
                <p className="mt-3 text-sm leading-6 text-slate">
                  {returnRequest.cancellation.reason}
                </p>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export { ReturnDetailsPage };
