import { ArrowLeft, Check, CreditCard, IndianRupee, MapPin, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { useCart } from "@/features/cart/hooks/use-cart";
import { CheckoutOrderReview } from "@/features/checkout/components/checkout-order-review";
import { checkoutSchema } from "@/features/checkout/schemas/checkout-schema";
import { CHECKOUT_STEPS, useCheckoutStore } from "@/features/checkout/store/checkout-store";

import { toast } from "sonner";

import { useCreateOrder } from "@/features/orders/hooks/use-create-order";
import { OrderCreationResult } from "@/features/orders/components/order-creation-result";

import { buildOrderRequest } from "@/features/checkout/utils/build-order-request";
import { createCheckoutIdempotencyKey } from "@/features/checkout/utils/checkout-idempotency";

const CART_CONFLICT_ERROR_CODES = new Set([
  "ORDER_PRODUCT_UNAVAILABLE",
  "ORDER_VARIANT_UNAVAILABLE",
  "ORDER_PRODUCT_IMAGE_UNAVAILABLE",
  "ORDER_PRODUCT_PRICE_UNAVAILABLE",
  "ORDER_PRODUCT_INVENTORY_INVALID",
  "ORDER_INSUFFICIENT_AVAILABLE_STOCK",
  "ORDER_INVENTORY_RESERVATION_CONFLICT",
]);

function CheckoutPage() {
  const user = useAuthStore((state) => state.user);

  const cartQuery = useCart();

  const createOrderMutation = useCreateOrder();

  const idempotencyKeyRef = useRef(null);

  const submittingRef = useRef(false);

  const step = useCheckoutStore((state) => state.step);

  const setStep = useCheckoutStore((state) => state.setStep);

  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  const fullName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const defaultValues = useMemo(
    () => ({
      shippingAddress: {
        fullName: fullName ?? "",
        phone: user?.phone ?? "",
        alternatePhone: "",
        email: user?.email ?? "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },

      paymentMethod: "cash-on-delivery",

      customerNote: "",
    }),
    [fullName, user?.email, user?.phone],
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),

    defaultValues,
  });

  useEffect(() => {
    resetCheckout();

    return () => {
      resetCheckout();
    };
  }, [resetCheckout]);

  const cart = cartQuery.data;

  const items = cart?.items ?? [];

  const hasUnavailableItems = items.some((item) => !item.availability?.isAvailable);

  const orderResult = createOrderMutation.data;

  if (orderResult) {
    return <OrderCreationResult result={orderResult} />;
  }

  const onContinueToReview = () => {
    setStep(CHECKOUT_STEPS.REVIEW);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePlaceOrder = async (values) => {
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;

    try {
      const orderData = buildOrderRequest({
        cart,
        checkoutValues: values,
      });

      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = createCheckoutIdempotencyKey();
      }

      const result = await createOrderMutation.mutateAsync({
        orderData,

        idempotencyKey: idempotencyKeyRef.current,
      });

      toast.success(
        result.wasReused
          ? "Your existing order was recovered safely."
          : "Order created successfully.",
      );
    } catch (error) {
      if (
        error?.code === "ORDER_IDEMPOTENCY_KEY_INVALID" ||
        error?.code === "ORDER_IDEMPOTENCY_KEY_REUSED"
      ) {
        idempotencyKeyRef.current = null;
      }

      if (CART_CONFLICT_ERROR_CODES.has(error?.code)) {
        await cartQuery.refetch();
      }

      toast.error(error?.message ?? "Unable to place your order. Please try again.");
    } finally {
      submittingRef.current = false;
    }
  };

  const handlePlaceOrderClick = () => {
    const submitOrder = handleSubmit(handlePlaceOrder);

    submitOrder();
  };

  if (cartQuery.isPending) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <LoadingSkeleton rows={10} />
        </PageContainer>
      </main>
    );
  }

  if (cartQuery.isError) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <ErrorState
            title="We couldn't prepare checkout."
            description={cartQuery.error?.message ?? "Please try again."}
            onRetry={() => cartQuery.refetch()}
          />
        </PageContainer>
      </main>
    );
  }

  if (items.length === 0) {
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
            ]}
          />

          <div className="mt-8">
            <EmptyState
              title="Your bag is empty."
              description="Add something to your bag before starting checkout."
              action={
                <Button asChild size="lg">
                  <Link to="/shop">
                    <ShoppingBag className="size-4" aria-hidden="true" />
                    Start shopping
                  </Link>
                </Button>
              }
            />
          </div>
        </PageContainer>
      </main>
    );
  }

  if (hasUnavailableItems) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <ErrorState
            title="Your bag needs attention."
            description="Resolve unavailable products, variants, or stock quantities before checkout."
          />

          <div className="flex justify-center">
            <Button asChild>
              <Link to="/cart">Review your bag</Link>
            </Button>
          </div>
        </PageContainer>
      </main>
    );
  }

  const reviewValues = step === CHECKOUT_STEPS.REVIEW ? getValues() : null;

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
              label: "Your Bag",
              to: "/cart",
            },
            {
              label: "Checkout",
            },
          ]}
        />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Secure checkout
            </p>

            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Checkout
            </h1>

            <p className="mt-3 text-sm text-slate">
              {step === CHECKOUT_STEPS.DETAILS
                ? "Enter your delivery and payment details."
                : "Review everything before placing your order."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            <span className={step === CHECKOUT_STEPS.DETAILS ? "text-ink" : "text-slate"}>
              01 Details
            </span>

            <span className="text-cloud">/</span>

            <span className={step === CHECKOUT_STEPS.REVIEW ? "text-ink" : "text-slate"}>
              02 Review
            </span>
          </div>
        </div>

        {step === CHECKOUT_STEPS.DETAILS ? (
          <form
            className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-14"
            onSubmit={handleSubmit(onContinueToReview)}
          >
            <div className="min-w-0 space-y-8">
              <section className="rounded-xl border border-cloud bg-soft-white p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-mint">
                    <MapPin className="size-4" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                      Step 1
                    </p>

                    <h2 className="font-display text-2xl font-semibold">Contact & delivery</h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">Full name</Label>

                    <Input
                      id="fullName"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.shippingAddress?.fullName)}
                      {...register("shippingAddress.fullName")}
                    />

                    {errors.shippingAddress?.fullName && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-slate">(optional)</span>
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.shippingAddress?.email)}
                      {...register("shippingAddress.email")}
                    />

                    {errors.shippingAddress?.email && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>

                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+919876543210"
                      aria-invalid={Boolean(errors.shippingAddress?.phone)}
                      {...register("shippingAddress.phone")}
                    />

                    {errors.shippingAddress?.phone && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="alternatePhone">
                      Alternate phone <span className="text-slate">(optional)</span>
                    </Label>

                    <Input
                      id="alternatePhone"
                      type="tel"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.shippingAddress?.alternatePhone)}
                      {...register("shippingAddress.alternatePhone")}
                    />

                    {errors.shippingAddress?.alternatePhone && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.alternatePhone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="addressLine1">Address line 1</Label>

                    <Input
                      id="addressLine1"
                      autoComplete="address-line1"
                      placeholder="Flat / House / Building / Street"
                      aria-invalid={Boolean(errors.shippingAddress?.addressLine1)}
                      {...register("shippingAddress.addressLine1")}
                    />

                    {errors.shippingAddress?.addressLine1 && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.addressLine1.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="addressLine2">
                      Address line 2 <span className="text-slate">(optional)</span>
                    </Label>

                    <Input
                      id="addressLine2"
                      autoComplete="address-line2"
                      aria-invalid={Boolean(errors.shippingAddress?.addressLine2)}
                      {...register("shippingAddress.addressLine2")}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="landmark">
                      Landmark <span className="text-slate">(optional)</span>
                    </Label>

                    <Input
                      id="landmark"
                      placeholder="Near..."
                      aria-invalid={Boolean(errors.shippingAddress?.landmark)}
                      {...register("shippingAddress.landmark")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>

                    <Input
                      id="city"
                      autoComplete="address-level2"
                      aria-invalid={Boolean(errors.shippingAddress?.city)}
                      {...register("shippingAddress.city")}
                    />

                    {errors.shippingAddress?.city && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>

                    <Input
                      id="state"
                      autoComplete="address-level1"
                      aria-invalid={Boolean(errors.shippingAddress?.state)}
                      {...register("shippingAddress.state")}
                    />

                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">PIN code</Label>

                    <Input
                      id="postalCode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                      aria-invalid={Boolean(errors.shippingAddress?.postalCode)}
                      {...register("shippingAddress.postalCode")}
                    />

                    {errors.shippingAddress?.postalCode && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.postalCode.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>

                    <Input
                      id="country"
                      readOnly
                      value="India"
                      {...register("shippingAddress.country")}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-cloud bg-soft-white p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-mint">
                    <CreditCard className="size-4" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                      Step 2
                    </p>

                    <h2 className="font-display text-2xl font-semibold">Payment method</h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-3">
                  <label className="flex cursor-pointer gap-4 rounded-lg border border-cloud bg-white p-4 has-[:checked]:border-ink">
                    <input
                      type="radio"
                      value="cash-on-delivery"
                      className="mt-1"
                      {...register("paymentMethod")}
                    />

                    <div>
                      <div className="flex items-center gap-2 font-semibold">
                        <IndianRupee className="size-4" aria-hidden="true" />
                        Cash on delivery
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate">
                        Pay when your order is delivered.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer gap-4 rounded-lg border border-cloud bg-white p-4 has-[:checked]:border-ink">
                    <input
                      type="radio"
                      value="online"
                      className="mt-1"
                      {...register("paymentMethod")}
                    />

                    <div>
                      <div className="flex items-center gap-2 font-semibold">
                        <CreditCard className="size-4" aria-hidden="true" />
                        Online payment
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate">
                        Razorpay payment will be started after the order is created.
                      </p>
                    </div>
                  </label>
                </div>

                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-destructive">{errors.paymentMethod.message}</p>
                )}
              </section>

              <section className="rounded-xl border border-cloud bg-soft-white p-5 sm:p-7">
                <Label htmlFor="customerNote">
                  Delivery note <span className="text-slate">(optional)</span>
                </Label>

                <Textarea
                  id="customerNote"
                  maxLength={500}
                  placeholder="Example: Please call before delivery."
                  className="mt-3"
                  aria-invalid={Boolean(errors.customerNote)}
                  {...register("customerNote")}
                />

                {errors.customerNote && (
                  <p className="mt-2 text-sm text-destructive">{errors.customerNote.message}</p>
                )}
              </section>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button asChild variant="ghost">
                  <Link to="/cart">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to bag
                  </Link>
                </Button>

                <Button type="submit" size="lg" className="sm:min-w-48">
                  Continue to review
                </Button>
              </div>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-28">
              <div className="rounded-xl border border-cloud bg-soft-white p-6">
                <CheckoutOrderReview cart={cart} />
              </div>
            </aside>
          </form>
        ) : (
          <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-14">
            <div className="min-w-0 space-y-6">
              <section className="rounded-xl border border-cloud bg-soft-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-mint">
                    <Check className="size-4" aria-hidden="true" />
                  </div>

                  <h2 className="font-display text-2xl font-semibold">Delivery details</h2>
                </div>

                <div className="mt-6 text-sm leading-7">
                  <p className="font-semibold">{reviewValues.shippingAddress.fullName}</p>

                  <p className="mt-2 text-slate">
                    {reviewValues.shippingAddress.addressLine1}

                    {reviewValues.shippingAddress.addressLine2
                      ? `, ${reviewValues.shippingAddress.addressLine2}`
                      : ""}
                  </p>

                  {reviewValues.shippingAddress.landmark && (
                    <p className="text-slate">{reviewValues.shippingAddress.landmark}</p>
                  )}

                  <p className="text-slate">
                    {reviewValues.shippingAddress.city}, {reviewValues.shippingAddress.state}{" "}
                    {reviewValues.shippingAddress.postalCode}
                  </p>

                  <p className="text-slate">India</p>

                  <p className="mt-4">{reviewValues.shippingAddress.phone}</p>

                  {reviewValues.shippingAddress.email && (
                    <p>{reviewValues.shippingAddress.email}</p>
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-cloud bg-soft-white p-6">
                <h2 className="font-display text-2xl font-semibold">Payment</h2>

                <p className="mt-4 font-semibold">
                  {reviewValues.paymentMethod === "cash-on-delivery"
                    ? "Cash on delivery"
                    : "Online payment"}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate">
                  {reviewValues.paymentMethod === "cash-on-delivery"
                    ? "Payment will be collected when the order is delivered."
                    : "Razorpay payment will continue after order creation."}
                </p>
              </section>

              {reviewValues.customerNote && (
                <section className="rounded-xl border border-cloud bg-soft-white p-6">
                  <h2 className="font-display text-2xl font-semibold">Delivery note</h2>

                  <p className="mt-4 text-sm leading-6 text-slate">{reviewValues.customerNote}</p>
                </section>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    idempotencyKeyRef.current = null;

                    setStep(CHECKOUT_STEPS.DETAILS);
                  }}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Edit details
                </Button>

                <div className="sm:text-right">
                  <Button
                    type="button"
                    size="lg"
                    className="sm:min-w-48"
                    disabled={createOrderMutation.isPending}
                    onClick={handlePlaceOrderClick}
                  >
                    {createOrderMutation.isPending ? "Placing order..." : "Place order"}
                  </Button>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate">
                    Your final price and inventory are verified again by the backend before the
                    order is created.
                  </p>
                </div>
              </div>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-28">
              <div className="rounded-xl border border-cloud bg-soft-white p-6">
                <CheckoutOrderReview cart={cart} />
              </div>
            </aside>
          </div>
        )}
      </PageContainer>
    </main>
  );
}

export { CheckoutPage };
