import { AlertTriangle, CheckCircle2, Clock3, CreditCard, RefreshCw, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Currency } from "@/components/common/currency";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

function OnlinePaymentResult({
  state,
  order,
  payment,
  providerStatus = null,
  providerFailure = null,
  verificationError = null,
  isCartClearing = false,
  cartClearError = null,
  isRetryingPayment = false,
  onRetryPayment,
  onRetryCartClear,
}) {
  const isSuccess = state === "success";
  const isProcessing = state === "processing";
  const isFailed = state === "failed";
  const isManualReview = state === "manual-review";
  const isVerificationError = state === "verification-error";

  const title = isSuccess
    ? "Payment successful."
    : isProcessing
      ? "Payment is processing."
      : isFailed
        ? "Payment wasn't completed."
        : isManualReview
          ? "Payment needs review."
          : "We're checking your payment.";

  const description = isSuccess
    ? "Your payment was verified securely and your order has been confirmed."
    : isProcessing
      ? "Your payment has reached Razorpay, but the backend has not finalized the order yet. Please do not make another payment."
      : isFailed
        ? "Razorpay did not complete this payment. Your order remains pending and you can safely try the payment again."
        : isManualReview
          ? "Payment may have been captured after the order reservation changed. Please do not make another payment for this order."
          : "We could not complete backend verification yet. The payment may still be reconciled automatically, so please do not pay again immediately.";

  const StatusIcon = isSuccess
    ? CheckCircle2
    : isProcessing
      ? Clock3
      : isFailed
        ? XCircle
        : AlertTriangle;

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
              label: "Payment result",
            },
          ]}
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-9">
            <div
              className={
                isSuccess
                  ? "flex size-14 items-center justify-center rounded-full bg-mint"
                  : "flex size-14 items-center justify-center rounded-full bg-cloud/50"
              }
            >
              <StatusIcon className="size-7" aria-hidden="true" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Online payment
            </p>

            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate">{description}</p>

            <div className="mt-8 divide-y divide-cloud border-y border-cloud">
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order number</span>

                <span className="text-sm font-semibold">{order.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order status</span>

                <span className="text-sm font-semibold capitalize">
                  {order.status ?? "pending"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Payment status</span>

                <span className="text-sm font-semibold capitalize">
                  {payment?.status ?? order.payment?.status ?? "pending"}
                </span>
              </div>

              {providerStatus && (
                <div className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm text-slate">Provider status</span>

                  <span className="text-sm font-semibold capitalize">{providerStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order total</span>

                <Currency
                  value={order.totals?.grandTotal ?? 0}
                  currency={order.totals?.currency ?? "INR"}
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            {isSuccess && (
              <div className="mt-7 rounded-lg bg-mint/40 p-4">
                <p className="text-sm font-semibold">Your order is confirmed.</p>

                <p className="mt-1 text-sm leading-6 text-slate">
                  Payment has been verified and your reserved inventory has been committed to this
                  order.
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="mt-7 flex gap-3 rounded-lg bg-cloud/30 p-4">
                <Clock3 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />

                <div>
                  <p className="text-sm font-semibold">No action needed right now.</p>

                  <p className="mt-1 text-sm leading-6 text-slate">
                    Do not start another payment while this payment is still being processed.
                  </p>
                </div>
              </div>
            )}

            {isFailed && (
              <div className="mt-7 rounded-lg bg-coral/10 p-4">
                <p className="text-sm font-semibold text-coral">
                  {providerFailure?.description ?? "The payment was not completed."}
                </p>

                <p className="mt-1 text-xs leading-5 text-coral">
                  You can retry the payment without creating another order.
                </p>
              </div>
            )}

            {isManualReview && (
              <div className="mt-7 rounded-lg bg-coral/10 p-4">
                <p className="text-sm font-semibold text-coral">Do not make another payment.</p>

                <p className="mt-1 text-xs leading-5 text-coral">
                  The payment requires backend reconciliation before this order can continue.
                </p>
              </div>
            )}

            {isVerificationError && (
              <div className="mt-7 rounded-lg bg-coral/10 p-4">
                <p className="text-sm font-semibold text-coral">
                  We couldn't verify the payment yet.
                </p>

                <p className="mt-1 text-xs leading-5 text-coral">
                  {verificationError?.message ??
                    "The payment may still be reconciled through Razorpay webhook processing. Do not pay again immediately."}
                </p>
              </div>
            )}

            {isCartClearing && (
              <div className="mt-5 flex items-center gap-3 rounded-lg bg-cloud/30 p-4">
                <RefreshCw className="size-4 animate-spin" aria-hidden="true" />

                <p className="text-sm text-slate">Finalizing your bag...</p>
              </div>
            )}

            {isSuccess && cartClearError && !isCartClearing && (
              <div className="mt-5 rounded-lg bg-coral/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-coral" aria-hidden="true" />

                  <div>
                    <p className="text-sm font-semibold text-coral">
                      Your payment and order are safe, but we couldn't clear your bag.
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

            {isFailed && (
              <Button
                type="button"
                size="lg"
                className="mt-8 w-full"
                disabled={isRetryingPayment}
                onClick={onRetryPayment}
              >
                {isRetryingPayment ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                    Preparing payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="size-4" aria-hidden="true" />
                    Try payment again
                  </>
                )}
              </Button>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isSuccess && (
                <Button asChild size="lg" className="sm:flex-1">
                  <Link to="/shop">Continue shopping</Link>
                </Button>
              )}

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

export { OnlinePaymentResult };
