import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/error-state";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useProduct } from "@/features/products/hooks/use-product";
import {
  formatProductMoney,
  formatProductPriceRange,
} from "@/features/products/utils/product-price";
import { useStorefrontUiStore } from "@/stores/storefront-ui-store";
import { useWishlistManager } from "@/features/wishlist/hooks/use-wishlist-manager";

function getColorKey(variant) {
  return `${variant.color?.name ?? ""}|${variant.color?.code ?? ""}`;
}

function QuickShopDrawer() {
  const isOpen = useStorefrontUiStore((state) => state.isQuickShopOpen);

  const slug = useStorefrontUiStore((state) => state.quickShopSlug);

  const setOpen = useStorefrontUiStore((state) => state.setQuickShopOpen);

  const productQuery = useProduct(slug, {
    enabled: isOpen && Boolean(slug),
  });

  const product = productQuery.data;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-porcelain sm:max-w-md">
        <SheetHeader className="border-b border-cloud pb-5 text-left">
          <SheetTitle className="font-display text-3xl font-semibold">Quick Shop</SheetTitle>

          <SheetDescription>
            Choose your preferred variant before adding the item to your bag.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          {productQuery.isPending && <LoadingSkeleton rows={6} />}

          {productQuery.isError && (
            <ErrorState
              title="Product unavailable."
              description={productQuery.error?.message ?? "We couldn't load this product."}
              onRetry={() => productQuery.refetch()}
            />
          )}

          {product && (
            <QuickShopContent
              key={product.id}
              product={product}
              closeQuickShop={() => setOpen(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function QuickShopContent({ product, closeQuickShop }) {
  const variants = product.variants ?? [];

  const initialVariant =
    variants.find((variant) => variant.availability?.isInStock) ?? variants[0] ?? null;

  const [selectedColorKey, setSelectedColorKey] = useState(() =>
    initialVariant ? getColorKey(initialVariant) : "",
  );

  const [selectedSize, setSelectedSize] = useState(() => initialVariant?.size ?? "");

  const [quantity, setQuantity] = useState(1);

  const primaryImage =
    product.images?.find((image) => image.isPrimary) ?? product.images?.[0] ?? null;

  const colorMap = new Map();

  variants.forEach((variant) => {
    const key = getColorKey(variant);

    if (!colorMap.has(key)) {
      colorMap.set(key, {
        key,
        name: variant.color?.name ?? "",
        code: variant.color?.code ?? "",
      });
    }
  });

  const colors = [...colorMap.values()];

  const variantsForColor = variants.filter((variant) => getColorKey(variant) === selectedColorKey);

  const selectedVariant = variantsForColor.find((variant) => variant.size === selectedSize) ?? null;

  const pricing = selectedVariant?.pricing;

  const availability = selectedVariant?.availability;

  const isInStock = Boolean(selectedVariant && availability?.isInStock);

  const availableStock = availability?.availableStock ?? 0;

  const maximumQuantity = Math.max(availableStock, 1);

  const handleColorChange = (colorKey) => {
    setSelectedColorKey(colorKey);

    const nextVariant =
      variants.find(
        (variant) => getColorKey(variant) === colorKey && variant.availability?.isInStock,
      ) ?? variants.find((variant) => getColorKey(variant) === colorKey);

    setSelectedSize(nextVariant?.size ?? "");

    setQuantity(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a product variant.");

      return;
    }

    /*
     * Part 29 will replace this
     * with the real cart mutation.
     */
    toast.info(
      `Selected ${selectedVariant.size} × ${quantity}. Cart API integration comes in Part 29.`,
    );
  };

  const { isPendingFor, toggleWishlist, wishlistedProductIds } = useWishlistManager();

  const isWishlisted = wishlistedProductIds.has(product.id);

  const isWishlistPending = isPendingFor(product.id);

  return (
    <div>
      {/* Product image */}
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-cloud/30">
        <ImageWithFallback
          src={primaryImage?.url ?? ""}
          alt={primaryImage?.altText || product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Essential product information */}
      <div className="mt-6">
        {product.brand?.name && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            {product.brand.name}
          </p>
        )}

        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
          {product.name}
        </h2>

        {product.shortDescription && (
          <p className="mt-3 text-sm leading-6 text-slate">{product.shortDescription}</p>
        )}

        <div className="mt-5">
          {pricing ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-semibold">
                {formatProductMoney(pricing.effectivePrice, pricing.currency)}
              </span>

              {pricing.hasDiscount && (
                <>
                  <span className="text-sm text-slate line-through">
                    {formatProductMoney(pricing.sellingPrice, pricing.currency)}
                  </span>

                  <span className="rounded-full bg-mint px-2 py-1 text-xs font-semibold">
                    {pricing.discountPercentage}% off
                  </span>
                </>
              )}
            </div>
          ) : (
            <p className="text-xl font-semibold">{formatProductPriceRange(product.priceRange)}</p>
          )}
        </div>
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <section className="mt-7">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Color</h3>

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
                  aria-label={`Select ${color.name}`}
                  aria-pressed={selected}
                  className={`flex size-10 items-center justify-center rounded-full border ${
                    selected ? "border-ink" : "border-cloud"
                  }`}
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

      {/* Sizes */}
      <section className="mt-7">
        <h3 className="text-sm font-semibold">Size</h3>

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
                  selected ? "border-ink bg-ink text-white" : "border-cloud bg-white"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
      </section>

      {/* Stock */}
      <div className="mt-4 text-sm">
        {selectedVariant && !isInStock && <p className="font-medium text-coral">Out of stock</p>}

        {isInStock && availability?.isLowStock && (
          <p className="font-medium text-amber-700">Low stock — only {availableStock} left</p>
        )}

        {isInStock && !availability?.isLowStock && <p className="text-slate">In stock</p>}
      </div>

      {/* Quantity */}
      <section className="mt-7">
        <h3 className="text-sm font-semibold">Quantity</h3>

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
      <div className="mt-8 space-y-3">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!isInStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Add to cart
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isWishlistPending}
          onClick={() => toggleWishlist(product)}
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

        <Button asChild type="button" variant="outline" size="lg" className="w-full">
          <Link to={`/product/${product.slug}`} onClick={closeQuickShop}>
            View full details
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { QuickShopDrawer };
