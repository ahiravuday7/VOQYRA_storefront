import { AlertTriangle, CheckCircle2, PackageCheck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Currency } from "@/components/common/currency";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

function CodOrderConfirmation({
  result,
  isCartClearing = false,
  cartClearError = null,
  onRetryCartClear,
}) {
  const order = result.order;

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <PageContainer>
        <Breadcrumbs
          items={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Order placed",
            },
          ]}
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-9">
            <div className="flex size-14 items-center justify-center rounded-full bg-mint">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              {result.wasReused ? "Order safely recovered" : "Cash on delivery"}
            </p>

            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Your order is placed.
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate">
              {result.wasReused
                ? "We recovered your previous checkout attempt, so no duplicate order was created."
                : "Your order has been created successfully. Payment will be collected when your order is delivered."}
            </p>

            <div className="mt-8 divide-y divide-cloud border-y border-cloud">
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order number</span>

                <span className="text-sm font-semibold">{order.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Payment method</span>

                <span className="text-sm font-semibold">Cash on delivery</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Payment status</span>

                <span className="text-sm font-semibold capitalize">
                  {order.payment?.status ?? "pending"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order status</span>

                <span className="text-sm font-semibold capitalize">{order.status}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Inventory</span>

                <span className="text-sm font-semibold capitalize">{order.inventoryStatus}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order total</span>

                <Currency
                  value={order.totals?.grandTotal ?? 0}
                  currency={order.totals?.currency ?? "INR"}
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            <div className="mt-7 flex gap-3 rounded-lg bg-mint/40 p-4">
              <PackageCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />

              <div>
                <p className="text-sm font-semibold">What happens next?</p>

                <p className="mt-1 text-sm leading-6 text-slate">
                  Your order is currently pending with inventory reserved. It will move through
                  confirmation, processing and shipping before delivery.
                </p>
              </div>
            </div>

            {isCartClearing && (
              <div className="mt-5 flex items-center gap-3 rounded-lg bg-cloud/30 p-4">
                <RefreshCw className="size-4 animate-spin" aria-hidden="true" />

                <p className="text-sm text-slate">Finalizing your bag...</p>
              </div>
            )}

            {cartClearError && !isCartClearing && (
              <div className="mt-5 rounded-lg bg-coral/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-coral" aria-hidden="true" />

                  <div>
                    <p className="text-sm font-semibold text-coral">
                      Your order is placed, but we couldn't clear your bag.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-coral">
                      Do not place the order again. Retry only the bag cleanup.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={onRetryCartClear}
                    >
                      <RefreshCw className="size-3.5" aria-hidden="true" />
                      Retry bag cleanup
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="sm:flex-1">
                <Link to="/shop">Continue shopping</Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="sm:flex-1">
                <Link to="/">Back to home</Link>
              </Button>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-slate">
              Keep your order number for reference:{" "}
              <span className="font-semibold text-ink">{order.orderNumber}</span>
            </p>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

export { CodOrderConfirmation };
