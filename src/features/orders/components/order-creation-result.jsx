import { CheckCircle2, Clock3 } from "lucide-react";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Currency } from "@/components/common/currency";
import { PageContainer } from "@/components/common/page-container";

function formatPaymentMethod(method) {
  if (method === "cash-on-delivery") {
    return "Cash on delivery";
  }

  if (method === "online") {
    return "Online payment";
  }

  return method ?? "—";
}

function OrderCreationResult({ result }) {
  const order = result.order;

  const isOnline = order.payment?.method === "online";

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
              label: "Checkout",
            },
            {
              label: "Order created",
            },
          ]}
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-9">
            <div className="flex size-14 items-center justify-center rounded-full bg-mint">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              {result.wasReused ? "Checkout safely recovered" : "Order received"}
            </p>

            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Your order is created.
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate">
              {result.wasReused
                ? "We found the order from your previous checkout attempt, so no duplicate order was created."
                : "Your order details have been accepted and inventory has been reserved by the backend."}
            </p>

            <div className="mt-8 divide-y divide-cloud border-y border-cloud">
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order number</span>

                <span className="text-sm font-semibold">{order.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Payment</span>

                <span className="text-sm font-semibold">
                  {formatPaymentMethod(order.payment?.method)}
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
                <span className="text-sm text-slate">Total</span>

                <Currency
                  value={order.totals?.grandTotal ?? 0}
                  currency={order.totals?.currency ?? "INR"}
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            <div className="mt-7 flex gap-3 rounded-lg bg-cloud/30 p-4">
              <Clock3 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

              <p className="text-sm leading-6 text-slate">
                {isOnline
                  ? "Your inventory is reserved. Online payment initiation is the next checkout step."
                  : "Your order uses cash on delivery. The COD completion and confirmation flow is the next checkout step."}
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

export { OrderCreationResult };
