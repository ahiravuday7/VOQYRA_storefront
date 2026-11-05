import { CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Currency } from "@/components/common/currency";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

import { useInitiateOnlinePayment } from "@/features/payments/hooks/use-initiate-online-payment";
import { loadRazorpayCheckout } from "@/features/payments/utils/load-razorpay-checkout";

function OnlinePaymentCheckout({ result }) {
  const order = result.order;

  const paymentMutation = useInitiateOnlinePayment();

  const [isOpeningCheckout, setIsOpeningCheckout] = useState(false);

  const [providerResponse, setProviderResponse] = useState(null);

  const [providerFailure, setProviderFailure] = useState(null);

  const handlePay = async () => {
    if (isOpeningCheckout || paymentMutation.isPending) {
      return;
    }

    setIsOpeningCheckout(true);

    setProviderResponse(null);

    setProviderFailure(null);

    try {
      const Razorpay = await loadRazorpayCheckout();

      const paymentSession = await paymentMutation.mutateAsync({
        orderId: order.id,
      });

      const { payment, checkout } = paymentSession;

      const razorpay = new Razorpay({
        key: checkout.keyId,

        amount: checkout.amount,

        currency: checkout.currency,

        name: "VOQYRA",

        description: `Order ${order.orderNumber}`,

        order_id: checkout.orderId,

        prefill: {
          name: order.shippingAddress?.fullName ?? "",

          email: order.shippingAddress?.email ?? "",

          contact: order.shippingAddress?.phone ?? "",
        },

        modal: {
          confirm_close: true,

          ondismiss: () => {
            toast.message(
              "Payment window closed. Your order remains pending and you can try again.",
            );
          },
        },

        /*
         * Part 36 will send these values
         * to our backend confirmation API.
         *
         * Browser callback alone is NOT
         * trusted as final payment truth.
         */
        handler: (razorpayResponse) => {
          setProviderResponse({
            paymentTransactionId: payment.id,

            ...razorpayResponse,
          });

          toast.success(
            "Razorpay returned payment details. Backend verification is the next step.",
          );
        },
      });

      /*
       * Razorpay Checkout may emit a
       * provider-side failure event.
       */
      if (typeof razorpay.on === "function") {
        razorpay.on("payment.failed", (response) => {
          const error = response?.error;

          setProviderFailure(
            error ?? {
              description: "Payment was not completed.",
            },
          );

          toast.error(error?.description ?? "Payment was not completed.");
        });
      }

      razorpay.open();
    } catch (error) {
      toast.error(error?.message ?? "Unable to start online payment.");
    } finally {
      setIsOpeningCheckout(false);
    }
  };

  const isBusy = isOpeningCheckout || paymentMutation.isPending;

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
              label: "Online payment",
            },
          ]}
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-9">
            <div className="flex size-14 items-center justify-center rounded-full bg-mint">
              <CreditCard className="size-7" aria-hidden="true" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Secure payment
            </p>

            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Complete your payment.
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate">
              Your order has been created and its inventory is reserved. Complete the payment
              securely through Razorpay.
            </p>

            <div className="mt-8 divide-y divide-cloud border-y border-cloud">
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order number</span>

                <span className="text-sm font-semibold">{order.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Order status</span>

                <span className="text-sm font-semibold capitalize">{order.status}</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Payment status</span>

                <span className="text-sm font-semibold capitalize">
                  {order.payment?.status ?? "pending"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-slate">Amount</span>

                <Currency
                  value={order.totals?.grandTotal ?? 0}
                  currency={order.totals?.currency ?? "INR"}
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            <div className="mt-7 flex gap-3 rounded-lg bg-cloud/30 p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />

              <p className="text-sm leading-6 text-slate">
                Payment details are entered in Razorpay Checkout. VOQYRA never receives your card,
                UPI PIN, or banking credentials.
              </p>
            </div>

            {paymentMutation.data && (
              <div className="mt-5 rounded-lg border border-cloud p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  Payment attempt
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {paymentMutation.data.payment.paymentNumber}
                </p>

                <p className="mt-1 text-xs text-slate">
                  {paymentMutation.data.action === "reuse"
                    ? "Existing active payment attempt reused safely."
                    : "New Razorpay payment attempt created."}
                </p>
              </div>
            )}

            {providerFailure && (
              <div className="mt-5 rounded-lg bg-coral/10 p-4">
                <p className="text-sm font-semibold text-coral">Payment was not completed.</p>

                <p className="mt-1 text-xs leading-5 text-coral">
                  {providerFailure.description ?? "You can safely try again."}
                </p>
              </div>
            )}

            {providerResponse && (
              <div className="mt-5 rounded-lg bg-mint/40 p-4">
                <p className="text-sm font-semibold">Razorpay returned payment details.</p>

                <p className="mt-1 text-xs leading-5 text-slate">
                  We are not marking this order as paid from the browser callback. Backend
                  verification will be connected in Part 36.
                </p>
              </div>
            )}

            <Button
              type="button"
              size="lg"
              className="mt-8 w-full"
              disabled={isBusy}
              onClick={handlePay}
            >
              {isBusy ? (
                <>
                  <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                  Preparing secure payment...
                </>
              ) : (
                <>
                  <CreditCard className="size-4" aria-hidden="true" />
                  Pay securely with Razorpay
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-xs leading-5 text-slate">
              Closing the payment window does not create another order. You can reopen the same
              active payment attempt safely.
            </p>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm font-semibold text-slate underline underline-offset-4"
              >
                Return to home
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

export { OnlinePaymentCheckout };
