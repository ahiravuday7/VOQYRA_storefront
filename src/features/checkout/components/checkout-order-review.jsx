import { Currency } from "@/components/common/currency";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

function CheckoutOrderReview({ cart }) {
  const items = cart?.items ?? [];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">Your order</p>

      <h2 className="mt-2 font-display text-3xl font-semibold">Order review</h2>

      <div className="mt-6 divide-y divide-cloud border-y border-cloud">
        {items.map((item) => {
          const product = item.product;

          return (
            <div key={item.id} className="flex gap-4 py-5">
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-cloud/30">
                <ImageWithFallback
                  src={product?.image?.url ?? ""}
                  alt={product?.image?.altText || product?.name || "Product"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-5">{product?.name ?? "Product unavailable"}</p>

                {item.variant?.sku && (
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate">
                    SKU: {item.variant.sku}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate">Qty: {item.quantity}</p>
              </div>

              <Currency
                value={item.pricing?.subtotal ?? 0}
                currency={item.pricing?.currency ?? "INR"}
                className="shrink-0 text-sm font-semibold"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate">Items</span>

          <span className="font-semibold">{cart?.totalQuantity ?? 0}</span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate">Subtotal</span>

          <Currency
            value={cart?.summary?.subtotal ?? 0}
            currency={cart?.summary?.currency ?? "INR"}
            className="font-semibold"
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate">Shipping</span>

          <span className="text-right font-semibold">Calculated during order processing</span>
        </div>
      </div>

      <div className="mt-6 border-t border-cloud pt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold">Current subtotal</p>

            <p className="mt-1 text-xs text-slate">Verified by the backend</p>
          </div>

          <Currency
            value={cart?.summary?.subtotal ?? 0}
            currency={cart?.summary?.currency ?? "INR"}
            className="text-xl font-semibold"
          />
        </div>
      </div>
    </div>
  );
}

export { CheckoutOrderReview };
