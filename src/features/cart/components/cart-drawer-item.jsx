import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Currency } from "@/components/common/currency";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

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

function CartDrawerItem({
  item,
  isUpdating = false,
  isRemoving = false,
  onUpdateQuantity,
  onRemove,
}) {
  const product = item.product;

  const availableStock = item.inventory?.availableStock ?? 0;

  const maximumQuantity = Math.min(availableStock, 99);

  const blockingReason = [
    "PRODUCT_NOT_FOUND",
    "PRODUCT_UNAVAILABLE",
    "VARIANT_NOT_FOUND",
    "VARIANT_UNAVAILABLE",
  ].includes(item.availability?.reason);

  const canDecrease = !blockingReason && item.quantity > 1 && item.quantity - 1 <= availableStock;

  const canIncrease = !blockingReason && item.quantity < maximumQuantity;

  const availabilityMessage = getAvailabilityMessage(item);

  const imageUrl = product?.image?.url ?? "";

  const imageAlt = product?.image?.altText || product?.name || "Cart product";

  return (
    <article className="border-b border-cloud py-5 last:border-b-0">
      <div className="flex gap-4">
        <div className="h-28 w-22 shrink-0 overflow-hidden rounded-lg bg-cloud/30">
          <ImageWithFallback src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          {product?.slug ? (
            <Link
              to={`/product/${product.slug}`}
              className="line-clamp-2 font-semibold leading-5 transition-colors hover:text-coral"
            >
              {product.name}
            </Link>
          ) : (
            <p className="font-semibold">Product unavailable</p>
          )}

          {item.variant?.sku && (
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate">
              SKU: {item.variant.sku}
            </p>
          )}

          <Currency
            value={item.pricing?.unitPrice ?? 0}
            currency={item.pricing?.currency ?? "INR"}
            className="mt-2 block text-sm font-semibold"
          />

          {availabilityMessage && (
            <p className="mt-2 text-xs font-medium text-coral">{availabilityMessage}</p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center rounded-md border border-cloud">
              <button
                type="button"
                disabled={!canDecrease || isUpdating}
                onClick={() => onUpdateQuantity?.(item, item.quantity - 1)}
                className="flex size-8 items-center justify-center transition hover:bg-cloud/40 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Decrease quantity of ${product?.name ?? "cart item"}`}
              >
                <Minus className="size-3.5" aria-hidden="true" />
              </button>

              <span className="min-w-9 text-center text-sm font-semibold">
                {isUpdating ? "…" : item.quantity}
              </span>

              <button
                type="button"
                disabled={!canIncrease || isUpdating}
                onClick={() => onUpdateQuantity?.(item, item.quantity + 1)}
                className="flex size-8 items-center justify-center transition hover:bg-cloud/40 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Increase quantity of ${product?.name ?? "cart item"}`}
              >
                <Plus className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              disabled={isRemoving}
              onClick={() => onRemove?.(item)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate transition hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />

              {isRemoving ? "Removing..." : "Remove"}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate">Item total</span>

            <Currency
              value={item.pricing?.subtotal ?? 0}
              currency={item.pricing?.currency ?? "INR"}
              className="font-semibold"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export { CartDrawerItem };
