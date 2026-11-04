import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { SizeGuideSheet } from "@/features/size-guides/components/size-guide-sheet";
import { formatProductMoney } from "@/features/products/utils/product-price";

function getColorKey(variant) {
  return `${variant.color?.name ?? ""}|${variant.color?.code ?? ""}`;
}

function ProductPurchasePanel({
  product,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
  isWishlistPending = false,
}) {
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  const initialVariant =
    variants.find((variant) => variant.availability?.isInStock) ?? variants[0] ?? null;

  const [selectedColorKey, setSelectedColorKey] = useState(() =>
    initialVariant ? getColorKey(initialVariant) : "",
  );

  const [selectedSize, setSelectedSize] = useState(() => initialVariant?.size ?? "");

  const [quantity, setQuantity] = useState(1);

  const colors = useMemo(() => {
    const map = new Map();

    variants.forEach((variant) => {
      const key = getColorKey(variant);

      if (!map.has(key)) {
        map.set(key, {
          key,
          name: variant.color?.name ?? "",
          code: variant.color?.code ?? "",
        });
      }
    });

    return [...map.values()];
  }, [variants]);

  const variantsForColor = useMemo(
    () => variants.filter((variant) => getColorKey(variant) === selectedColorKey),
    [variants, selectedColorKey],
  );

  const selectedVariant = variantsForColor.find((variant) => variant.size === selectedSize) ?? null;

  const handleColorChange = (colorKey) => {
    setSelectedColorKey(colorKey);

    const firstVariant =
      variants.find(
        (variant) => getColorKey(variant) === colorKey && variant.availability?.isInStock,
      ) ?? variants.find((variant) => getColorKey(variant) === colorKey);

    setSelectedSize(firstVariant?.size ?? "");

    setQuantity(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const pricing = selectedVariant?.pricing;

  const availability = selectedVariant?.availability;

  const maximumQuantity = Math.max(availability?.availableStock ?? 1, 1);

  const isInStock = Boolean(selectedVariant && availability?.isInStock);

  return (
    <div>
      {/* Price */}
      {pricing && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl font-semibold">
            {formatProductMoney(pricing.effectivePrice, pricing.currency)}
          </span>

          {pricing.hasDiscount && (
            <>
              <span className="text-base text-slate line-through">
                {formatProductMoney(pricing.sellingPrice, pricing.currency)}
              </span>

              <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold">
                {pricing.discountPercentage}% off
              </span>
            </>
          )}
        </div>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Color</h2>

            <span className="text-sm text-slate">
              {colors.find((color) => color.key === selectedColorKey)?.name}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            {colors.map((color) => {
              const selected = color.key === selectedColorKey;

              return (
                <button
                  key={color.key}
                  type="button"
                  onClick={() => handleColorChange(color.key)}
                  className={`flex size-10 items-center justify-center rounded-full border ${
                    selected ? "border-ink" : "border-cloud"
                  }`}
                  aria-label={`Select ${color.name}`}
                  aria-pressed={selected}
                >
                  <span
                    className="size-7 rounded-full border border-cloud"
                    style={{
                      backgroundColor: color.code || "transparent",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Size */}
      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">Size</h2>

          {product.sizeGuide?.slug && (
            <SizeGuideSheet
              slug={product.sizeGuide.slug}
              trigger={
                <button
                  type="button"
                  className="text-sm font-semibold underline underline-offset-4"
                >
                  Size guide
                </button>
              }
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {variantsForColor.map((variant) => {
            const selected = variant.size === selectedSize;

            const available = variant.availability?.isInStock;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={!available}
                onClick={() => handleSizeChange(variant.size)}
                className={`min-w-14 rounded-md border px-4 py-3 text-sm font-semibold transition ${
                  selected ? "border-ink bg-ink text-white" : "border-cloud bg-white text-ink"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
      </section>

      {/* Availability */}
      <div className="mt-5 text-sm">
        {!selectedVariant && <p className="text-slate">Select a variant.</p>}

        {selectedVariant && !isInStock && <p className="font-medium text-coral">Out of stock</p>}

        {isInStock && availability?.isLowStock && (
          <p className="font-medium text-amber-700">
            Low stock — only {availability.availableStock} left
          </p>
        )}

        {isInStock && !availability?.isLowStock && <p className="text-slate">In stock</p>}
      </div>

      {/* Quantity */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold">Quantity</h2>

        <div className="mt-3 inline-flex items-center rounded-md border border-cloud bg-white">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex size-11 items-center justify-center disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>

          <span className="min-w-12 text-center text-sm font-semibold">{quantity}</span>

          <button
            type="button"
            disabled={!isInStock || quantity >= maximumQuantity}
            onClick={() => setQuantity((current) => Math.min(maximumQuantity, current + 1))}
            className="flex size-11 items-center justify-center disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-8 grid grid-cols-[1fr_auto] gap-3">
        <Button
          type="button"
          size="lg"
          disabled={!isInStock}
          onClick={() =>
            onAddToCart?.({
              product,
              variant: selectedVariant,
              quantity,
            })
          }
          className="h-13"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Add to cart
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isWishlistPending}
          onClick={onWishlist}
          className="w-full"
        >
          <Heart
            className={`size-4 ${isWishlisted ? "fill-coral text-coral" : ""}`}
            aria-hidden="true"
          />

          {isWishlistPending
            ? "Updating..."
            : isWishlisted
              ? "Saved to wishlist"
              : "Add to wishlist"}
        </Button>
      </div>
    </div>
  );
}

export { ProductPurchasePanel };
