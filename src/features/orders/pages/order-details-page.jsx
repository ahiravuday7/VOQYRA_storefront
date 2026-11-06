import { ArrowLeft, Clock3, ExternalLink, MapPin, Package, Truck, WalletCards } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Currency } from "@/components/common/currency";
import { ErrorState } from "@/components/common/error-state";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";

import { useOrder } from "@/features/orders/hooks/use-order";

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

function formatPaymentMethod(method) {
  if (method === "cash-on-delivery") {
    return "Cash on delivery";
  }

  if (method === "online") {
    return "Online payment";
  }

  return method ?? "Unavailable";
}

function OrderDetailsPage() {
  const { orderId } = useParams();

  const orderQuery = useOrder(orderId);

  if (orderQuery.isPending) {
    return (
      <LoadingSkeleton rows={6} className="rounded-2xl border border-cloud bg-soft-white p-5" />
    );
  }

  if (orderQuery.isError) {
    const isNotFound = orderQuery.error?.errorCode === "ORDER_NOT_FOUND";

    return (
      <div className="rounded-2xl border border-cloud bg-soft-white">
        <ErrorState
          title={isNotFound ? "Order not found." : "We couldn't load this order."}
          description={
            isNotFound
              ? "This order could not be found in your account."
              : (orderQuery.error?.message ?? "Please try again.")
          }
          onRetry={isNotFound ? undefined : () => orderQuery.refetch()}
        />

        <div className="pb-8 text-center">
          <Button asChild variant="outline">
            <Link to="/account/orders">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = orderQuery.data;

  const items = order.items ?? [];

  const totalQuantity = items.reduce((total, item) => total + Number(item.quantity ?? 0), 0);

  const shipmentState = order.shipment?.deliveredAt
    ? "Delivered"
    : order.shipment?.shippedAt
      ? "Shipped"
      : "Not shipped yet";

  return (
    <div>
      <Button asChild variant="ghost" className="-ml-3 mb-5">
        <Link to="/account/orders">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to orders
        </Link>
      </Button>

      <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Order details
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">
                {order.orderNumber}
              </h2>

              <StatusBadge status={order.status} />
            </div>

            <p className="mt-3 text-sm text-slate">
              Placed {formatDateTime(order.createdAt) ?? "date unavailable"}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-[0.12em] text-slate">Order total</p>

            <Currency
              value={order.totals?.grandTotal ?? 0}
              currency={order.totals?.currency ?? "INR"}
              className="mt-1 text-2xl font-semibold"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-cloud pt-6 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-slate">Payment</p>

            <div className="mt-2">
              <StatusBadge status={order.payment?.status ?? "pending"} />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-slate">Inventory</p>

            <div className="mt-2">
              <StatusBadge status={order.inventoryStatus} />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-slate">Shipment</p>

            <p className="mt-2 text-sm font-semibold">{shipmentState}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-slate">Items</p>

            <p className="mt-2 text-sm font-semibold">{totalQuantity}</p>
          </div>
        </div>

        {order.inventoryReservationExpiresAt && order.status === "pending" && (
          <div className="mt-6 flex gap-3 rounded-lg bg-cloud/30 p-4">
            <Clock3 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

            <p className="text-sm leading-6 text-slate">
              Inventory reservation expires{" "}
              <span className="font-semibold text-ink">
                {formatDateTime(order.inventoryReservationExpiresAt) ??
                  "at the configured reservation deadline"}
              </span>
              .
            </p>
          </div>
        )}
      </div>

      {/* Items */}
      <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Package className="size-5" aria-hidden="true" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Items</p>

            <h3 className="mt-1 font-display text-2xl font-semibold">What you ordered.</h3>
          </div>
        </div>

        <div className="mt-6 divide-y divide-cloud border-y border-cloud">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-5 py-6 sm:flex-row">
              <ImageWithFallback
                src={item.image?.url}
                alt={item.image?.altText ?? item.productName}
                className="size-28 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
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

                  <Currency
                    value={item.pricing?.lineSubtotal ?? 0}
                    currency={item.pricing?.currency ?? order.totals?.currency ?? "INR"}
                    className="font-semibold"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate">
                  <span>
                    Unit price:{" "}
                    <Currency
                      value={item.pricing?.unitFinalPrice ?? 0}
                      currency={item.pricing?.currency ?? "INR"}
                    />
                  </span>

                  <span>
                    Inventory:{" "}
                    <span className="font-semibold capitalize text-ink">
                      {item.inventory?.status ?? "unknown"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Shipping address */}
        <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <MapPin className="size-5" aria-hidden="true" />

            <h3 className="font-display text-2xl font-semibold">Delivery address.</h3>
          </div>

          <div className="mt-6 text-sm leading-7">
            <p className="font-semibold">{order.shippingAddress?.fullName}</p>

            <p className="mt-2 text-slate">
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 && (
                <>
                  <br />

                  {order.shippingAddress.addressLine2}
                </>
              )}
              {order.shippingAddress?.landmark && (
                <>
                  <br />
                  Landmark: {order.shippingAddress.landmark}
                </>
              )}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
              {order.shippingAddress?.postalCode}
              <br />
              {order.shippingAddress?.country}
            </p>

            <div className="mt-5 border-t border-cloud pt-4 text-slate">
              <p>
                Phone: <span className="font-medium text-ink">{order.shippingAddress?.phone}</span>
              </p>

              {order.shippingAddress?.alternatePhone && (
                <p>
                  Alternate:{" "}
                  <span className="font-medium text-ink">
                    {order.shippingAddress.alternatePhone}
                  </span>
                </p>
              )}

              {order.shippingAddress?.email && (
                <p>
                  Email: <span className="font-medium text-ink">{order.shippingAddress.email}</span>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <WalletCards className="size-5" aria-hidden="true" />

            <h3 className="font-display text-2xl font-semibold">Payment.</h3>
          </div>

          <div className="mt-6 divide-y divide-cloud border-y border-cloud">
            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-sm text-slate">Method</span>

              <span className="text-sm font-semibold">
                {formatPaymentMethod(order.payment?.method)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-sm text-slate">Status</span>

              <StatusBadge status={order.payment?.status ?? "pending"} />
            </div>

            {order.payment?.paidAt && (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Paid</span>

                <span className="text-right text-sm font-semibold">
                  {formatDateTime(order.payment.paidAt)}
                </span>
              </div>
            )}

            {order.payment?.failedAt && (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Failed</span>

                <span className="text-right text-sm font-semibold">
                  {formatDateTime(order.payment.failedAt)}
                </span>
              </div>
            )}

            {order.payment?.refundedAt && (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Refunded</span>

                <span className="text-right text-sm font-semibold">
                  {formatDateTime(order.payment.refundedAt)}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Shipment */}
        <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Truck className="size-5" aria-hidden="true" />

            <h3 className="font-display text-2xl font-semibold">Shipment.</h3>
          </div>

          <div className="mt-6 divide-y divide-cloud border-y border-cloud">
            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-sm text-slate">Status</span>

              <span className="text-sm font-semibold">{shipmentState}</span>
            </div>

            {order.shipment?.carrier && (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Carrier</span>

                <span className="text-sm font-semibold">{order.shipment.carrier}</span>
              </div>
            )}

            {order.shipment?.trackingNumber && (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Tracking number</span>

                <span className="text-sm font-semibold">{order.shipment.trackingNumber}</span>
              </div>
            )}

            {order.shipment?.shippedAt && (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Shipped</span>

                <span className="text-right text-sm font-semibold">
                  {formatDateTime(order.shipment.shippedAt)}
                </span>
              </div>
            )}

            {order.shipment?.deliveredAt && (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Delivered</span>

                <span className="text-right text-sm font-semibold">
                  {formatDateTime(order.shipment.deliveredAt)}
                </span>
              </div>
            )}
          </div>

          {order.shipment?.trackingUrl && (
            <Button asChild variant="outline" className="mt-5">
              <a href={order.shipment.trackingUrl} target="_blank" rel="noreferrer">
                Track shipment
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </Button>
          )}
        </section>

        {/* Totals */}
        <section className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
          <h3 className="font-display text-2xl font-semibold">Order summary.</h3>

          <div className="mt-6 divide-y divide-cloud border-y border-cloud">
            <div className="flex justify-between gap-4 py-4">
              <span className="text-sm text-slate">Items subtotal</span>

              <Currency
                value={order.totals?.itemsSubtotal ?? 0}
                currency={order.totals?.currency ?? "INR"}
                className="font-semibold"
              />
            </div>

            <div className="flex justify-between gap-4 py-4">
              <span className="text-sm text-slate">Discount</span>

              <Currency
                value={order.totals?.discountAmount ?? 0}
                currency={order.totals?.currency ?? "INR"}
                className="font-semibold"
              />
            </div>

            <div className="flex justify-between gap-4 py-4">
              <span className="text-sm text-slate">Shipping</span>

              <Currency
                value={order.totals?.shippingAmount ?? 0}
                currency={order.totals?.currency ?? "INR"}
                className="font-semibold"
              />
            </div>

            <div className="flex justify-between gap-4 py-4">
              <span className="text-sm text-slate">Tax</span>

              <Currency
                value={order.totals?.taxAmount ?? 0}
                currency={order.totals?.currency ?? "INR"}
                className="font-semibold"
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-5">
              <span className="font-semibold">Total</span>

              <Currency
                value={order.totals?.grandTotal ?? 0}
                currency={order.totals?.currency ?? "INR"}
                className="text-lg font-semibold"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Timeline */}
      <section className="mt-6 rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Timeline</p>

        <h3 className="mt-2 font-display text-2xl font-semibold">Order progress.</h3>

        <div className="mt-7">
          {(order.statusHistory ?? []).length > 0 ? (
            <ol className="space-y-0">
              {order.statusHistory.map((history, index) => {
                const isLast = index === order.statusHistory.length - 1;

                return (
                  <li
                    key={history.id ?? `${history.status}-${index}`}
                    className="relative flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mt-1 size-3 rounded-full bg-ink" />

                      {!isLast && <div className="min-h-16 w-px flex-1 bg-cloud" />}
                    </div>

                    <div className="pb-7">
                      <StatusBadge status={history.status} />

                      <p className="mt-2 text-xs text-slate">
                        {formatDateTime(history.changedAt) ?? "Time unavailable"}
                      </p>

                      {history.note && (
                        <p className="mt-2 text-sm leading-6 text-slate">{history.note}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-slate">No status history is available yet.</p>
          )}
        </div>
      </section>

      {(order.customerNote || order.cancellation?.cancelledAt) && (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {order.customerNote && (
            <section className="rounded-2xl border border-cloud bg-soft-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Your note
              </p>

              <p className="mt-3 text-sm leading-7">{order.customerNote}</p>
            </section>
          )}

          {order.cancellation?.cancelledAt && (
            <section className="rounded-2xl border border-cloud bg-soft-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Cancellation
              </p>

              <p className="mt-3 text-sm font-semibold">Order cancelled</p>

              <p className="mt-1 text-xs text-slate">
                {formatDateTime(order.cancellation.cancelledAt)}
              </p>

              {order.cancellation?.reason && (
                <p className="mt-3 text-sm leading-6 text-slate">{order.cancellation.reason}</p>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export { OrderDetailsPage };
