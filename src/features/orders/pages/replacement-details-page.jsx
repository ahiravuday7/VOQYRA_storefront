import { ArrowLeft, ExternalLink, PackageCheck, RefreshCcw, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";

import { useReplacement } from "@/features/orders/hooks/use-replacement";

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

function buildReplacementTimeline(replacement) {
  return [
    {
      status: "reserved",
      label: "Replacement reserved",
      at: replacement.reservation?.reservedAt,
    },
    {
      status: "processing",
      label: "Replacement processing",
      at: replacement.processing?.processedAt,
    },
    {
      status: "shipped",
      label: "Replacement shipped",
      at: replacement.shipment?.shippedAt,
    },
    {
      status: "delivered",
      label: "Replacement delivered",
      at: replacement.shipment?.deliveredAt,
    },
    {
      status: "cancelled",
      label: "Replacement cancelled",
      at: replacement.cancellation?.cancelledAt,
    },
    {
      status: "failed",
      label: "Replacement failed",
      at: replacement.failure?.failedAt,
    },
  ]
    .filter((entry) => Boolean(entry.at))
    .sort((first, second) => new Date(first.at) - new Date(second.at));
}

function ReplacementDetailsPage() {
  const { replacementId } = useParams();

  const replacementQuery = useReplacement(replacementId);

  if (replacementQuery.isPending) {
    return (
      <LoadingSkeleton rows={6} className="rounded-2xl border border-cloud bg-soft-white p-5" />
    );
  }

  if (replacementQuery.isError) {
    const isNotFound = replacementQuery.error?.code === "ORDER_RETURN_REPLACEMENT_NOT_FOUND";

    return (
      <div className="rounded-2xl border border-cloud bg-soft-white">
        <ErrorState
          title={isNotFound ? "Replacement not found." : "We couldn't load this replacement."}
          description={
            isNotFound
              ? "This replacement could not be found in your account."
              : (replacementQuery.error?.message ?? "Please try again.")
          }
          onRetry={isNotFound ? undefined : () => replacementQuery.refetch()}
        />

        <div className="pb-8 text-center">
          <Button asChild variant="outline">
            <Link to="/account/replacements">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to replacements
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const replacement = replacementQuery.data;

  const timeline = buildReplacementTimeline(replacement);

  return (
    <div>
      <Button asChild variant="ghost" className="-ml-3 mb-5">
        <Link to="/account/replacements">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to replacements
        </Link>
      </Button>

      {/* Header */}
      <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Replacement
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">
                {replacement.replacementNumber}
              </h2>

              <StatusBadge status={replacement.status} />
            </div>

            <p className="mt-3 text-sm text-slate">
              Created {formatDateTime(replacement.createdAt) ?? "date unavailable"}
            </p>
          </div>

          <RefreshCcw className="size-8 text-slate" aria-hidden="true" />
        </div>

        <div className="mt-6 grid gap-4 border-t border-cloud pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate">Original order</p>

            <p className="mt-1 text-sm font-semibold">{replacement.orderNumber}</p>

            {replacement.orderId && (
              <Button asChild variant="link" className="mt-1 h-auto p-0">
                <Link to={`/account/orders/${replacement.orderId}`}>View order</Link>
              </Button>
            )}
          </div>

          <div>
            <p className="text-xs text-slate">Return request</p>

            <p className="mt-1 text-sm font-semibold">{replacement.returnRequestNumber}</p>

            {replacement.returnRequestId && (
              <Button asChild variant="link" className="mt-1 h-auto p-0">
                <Link to={`/account/returns/${replacement.returnRequestId}`}>View return</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <PackageCheck className="size-5" aria-hidden="true" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Replacement items
            </p>

            <h3 className="mt-1 font-display text-2xl font-semibold">What is being replaced.</h3>
          </div>
        </div>

        <div className="mt-6 divide-y divide-cloud border-y border-cloud">
          {(replacement.items ?? []).map((item) => (
            <article key={item.id ?? item.returnItemId} className="py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold">{item.productName}</p>

                  <p className="mt-1 text-xs text-slate">SKU: {item.sku}</p>

                  <p className="mt-2 text-sm text-slate">
                    {[item.size ? `Size ${item.size}` : null, item.color?.name ?? null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-slate">Replacement quantity</p>

                  <p className="mt-1 text-lg font-semibold">{item.replacementQuantity}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-cloud pt-4 text-xs text-slate">
                <span>
                  Returned quantity:{" "}
                  <span className="font-semibold text-ink">{item.returnedQuantity}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Shipment */}
      <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Truck className="size-5" aria-hidden="true" />

          <h3 className="font-display text-2xl font-semibold">Replacement shipment.</h3>
        </div>

        {replacement.shipment?.shippedAt ? (
          <>
            <div className="mt-6 divide-y divide-cloud border-y border-cloud">
              {replacement.shipment?.carrier && (
                <div className="flex justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Carrier</span>

                  <span className="text-sm font-semibold">{replacement.shipment.carrier}</span>
                </div>
              )}

              {replacement.shipment?.trackingNumber && (
                <div className="flex justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Tracking number</span>

                  <span className="text-right text-sm font-semibold">
                    {replacement.shipment.trackingNumber}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 py-4">
                <span className="text-sm text-slate">Shipped</span>

                <span className="text-right text-sm font-semibold">
                  {formatDateTime(replacement.shipment.shippedAt)}
                </span>
              </div>

              {replacement.shipment?.deliveredAt && (
                <div className="flex justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Delivered</span>

                  <span className="text-right text-sm font-semibold">
                    {formatDateTime(replacement.shipment.deliveredAt)}
                  </span>
                </div>
              )}
            </div>

            {replacement.shipment?.trackingUrl && (
              <Button asChild variant="outline" className="mt-5">
                <a href={replacement.shipment.trackingUrl} target="_blank" rel="noreferrer">
                  Track replacement
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            )}
          </>
        ) : (
          <p className="mt-5 text-sm leading-6 text-slate">
            Your replacement has not been shipped yet.
          </p>
        )}
      </section>

      {/* Timeline */}
      <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Timeline</p>

        <h3 className="mt-2 font-display text-2xl font-semibold">Replacement progress.</h3>

        {timeline.length > 0 ? (
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
        ) : (
          <p className="mt-5 text-sm text-slate">No replacement timeline is available yet.</p>
        )}
      </section>

      {/* Outcome */}
      {(replacement.cancellation?.cancelledAt ||
        replacement.failure?.failedAt ||
        replacement.shipment?.deliveredAt) && (
        <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Outcome</p>

          {replacement.shipment?.deliveredAt && (
            <div className="mt-4">
              <StatusBadge status="delivered" />

              <p className="mt-3 text-sm font-semibold">Replacement delivered successfully.</p>

              <p className="mt-1 text-xs text-slate">
                {formatDateTime(replacement.shipment.deliveredAt)}
              </p>
            </div>
          )}

          {replacement.cancellation?.cancelledAt && (
            <div className="mt-4">
              <StatusBadge status="cancelled" />

              <p className="mt-3 text-sm font-semibold">Replacement cancelled.</p>

              <p className="mt-1 text-xs text-slate">
                {formatDateTime(replacement.cancellation.cancelledAt)}
              </p>

              {replacement.cancellation?.reason && (
                <p className="mt-3 text-sm leading-6 text-slate">
                  {replacement.cancellation.reason}
                </p>
              )}
            </div>
          )}

          {replacement.failure?.failedAt && (
            <div className="mt-4">
              <StatusBadge status="failed" />

              <p className="mt-3 text-sm font-semibold">Replacement fulfillment failed.</p>

              <p className="mt-1 text-xs text-slate">
                {formatDateTime(replacement.failure.failedAt)}
              </p>

              {replacement.failure?.reason && (
                <p className="mt-3 text-sm leading-6 text-slate">{replacement.failure.reason}</p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export { ReplacementDetailsPage };
