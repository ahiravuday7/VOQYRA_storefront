import { AlertTriangle, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Currency } from "@/components/common/currency";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Button } from "@/components/ui/button";

function getAvailabilityMessage(item) {
  const reason = item.availability?.reason;

  switch (reason) {
    case "PRODUCT_NOT_FOUND":
      return "This product is no longer available.";

    case "PRODUCT_UNAVAILABLE":
      return "This product is currently unavailable.";

    case "VARIANT_NOT_FOUND":
      return "This option is no longer available.";

    case "VARIANT_UNAVAILABLE":
      return "This option is currently unavailable.";

    case "INSUFFICIENT_STOCK":
      return `Only ${item.inventory?.availableStock ?? 0} currently available.`;

    default:
      return null;
  }
}

function CartPageItem({
  item,
  isUpdating = false,
  isRemoving = false,
  onUpdateQuantity,
  onResolveStock,
  onRemove,
}) {
  const product = item.product;

  const availableStock = item.inventory?.availableStock ?? 0;

  const maximumQuantity = Math.min(availableStock, 99);

  const isAvailable = item.availability?.isAvailable === true;

  const isInsufficientStock = item.availability?.reason === "INSUFFICIENT_STOCK";

  const canDecrease = isAvailable && item.quantity > 1;

  const canIncrease = isAvailable && item.quantity < maximumQuantity;

  const availabilityMessage = getAvailabilityMessage(item);

  const imageUrl = product?.image?.url ?? "";

  const imageAlt = product?.image?.altText || product?.name || "Cart product";

  return (
    <article className="border-b border-cloud py-6 last:border-b-0">
      <div className="grid gap-5 sm:grid-cols-[112px_minmax(0,1fr)]">
        <div className="h-36 w-28 overflow-hidden rounded-lg bg-cloud/30">
          <ImageWithFallback src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {product?.slug ? (
                <Link
                  to={`/product/${product.slug}`}
                  className="font-display text-2xl font-semibold tracking-[-0.02em] transition-colors hover:text-coral"
                >
                  {product.name}
                </Link>
              ) : (
                <p className="font-display text-2xl font-semibold">Product unavailable</p>
              )}

              {item.variant?.sku && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  SKU: {item.variant.sku}
                </p>
              )}

              <div className="mt-3">
                <span className="text-xs text-slate">Unit price</span>

                <Currency
                  value={item.pricing?.unitPrice ?? 0}
                  currency={item.pricing?.currency ?? "INR"}
                  className="ml-2 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="sm:text-right">
              {isAvailable ? (
                <>
                  <p className="text-xs text-slate">Item total</p>

                  <Currency
                    value={item.pricing?.subtotal ?? 0}
                    currency={item.pricing?.currency ?? "INR"}
                    className="mt-1 block text-lg font-semibold"
                  />
                </>
              ) : (
                <p className="text-xs font-semibold text-coral">Excluded from subtotal</p>
              )}
            </div>
          </div>

          {availabilityMessage && (
            <div className="mt-4 flex gap-3 rounded-lg bg-coral/10 px-4 py-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-coral" aria-hidden="true" />

              <div>
                <p className="text-sm font-semibold text-coral">Item needs attention</p>

                <p className="mt-1 text-xs leading-5 text-coral">{availabilityMessage}</p>

                {isInsufficientStock && availableStock > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    disabled={isUpdating}
                    onClick={() => onResolveStock?.(item, availableStock)}
                  >
                    Set quantity to {availableStock}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center rounded-md border border-cloud bg-white">
              <button
                type="button"
                disabled={!canDecrease || isUpdating}
                onClick={() => onUpdateQuantity?.(item, item.quantity - 1)}
                className="flex size-10 items-center justify-center transition hover:bg-cloud/40 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Decrease quantity of ${product?.name ?? "cart item"}`}
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>

              <span className="min-w-11 text-center text-sm font-semibold">
                {isUpdating ? "…" : item.quantity}
              </span>

              <button
                type="button"
                disabled={!canIncrease || isUpdating}
                onClick={() => onUpdateQuantity?.(item, item.quantity + 1)}
                className="flex size-10 items-center justify-center transition hover:bg-cloud/40 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Increase quantity of ${product?.name ?? "cart item"}`}
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              disabled={isRemoving}
              onClick={() => onRemove?.(item)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate transition hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-4" aria-hidden="true" />

              {isRemoving ? "Removing..." : "Remove"}
            </button>
          </div>

          {isAvailable && <p className="mt-3 text-xs text-slate">{availableStock} available</p>}
        </div>
      </div>
    </article>
  );
}

export { CartPageItem };
