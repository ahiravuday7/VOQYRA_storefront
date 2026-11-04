import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { ProductBadges } from "@/features/products/components/product-badges";
import { formatProductPriceRange } from "@/features/products/utils/product-price";

function ProductCard({
  product,
  onWishlistClick,
  onQuickShop,
  isWishlisted = false,
  isWishlistPending = false,
}) {
  const imageUrl = product.primaryImage?.url ?? "";

  const imageAlt = product.primaryImage?.altText || product.name;

  const priceLabel = formatProductPriceRange(product.priceRange);

  const isInStock = product.availability?.isInStock ?? false;

  const isLowStock = product.availability?.isLowStock ?? false;

  const handleWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onWishlistClick?.(product);
  };

  const handleQuickShop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onQuickShop?.(product);
  };

  return (
    <article className="group motion-card">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cloud/30">
            <ProductBadges product={product} />

            <ImageWithFallback
              src={imageUrl}
              alt={imageAlt}
              className="motion-image h-full w-full object-cover"
            />

            {!isInStock && (
              <div className="absolute inset-x-0 bottom-0 bg-ink/90 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Sold out
              </div>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={isWishlistPending}
          aria-pressed={isWishlisted}
          className="motion-button absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart
            className={`size-4 ${isWishlisted ? "fill-coral text-coral" : ""}`}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={handleQuickShop}
          className="motion-button absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-ink shadow-sm transition hover:bg-ink hover:text-white"
          aria-label={`Quick shop ${product.name}`}
        >
          <Eye className="size-4" aria-hidden="true" />
          Quick shop
        </button>
      </div>

      <div className="mt-4">
        {product.brand?.name && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            {product.brand.name}
          </p>
        )}

        <Link to={`/product/${product.slug}`} className="mt-1 block">
          <h3 className="font-semibold leading-6 transition-colors hover:text-coral">
            {product.name}
          </h3>
        </Link>

        {product.category?.name && (
          <p className="mt-1 text-sm text-slate">{product.category.name}</p>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-semibold">{priceLabel}</p>

          {isInStock && isLowStock && (
            <span className="text-xs font-medium text-amber-700">Low stock</span>
          )}
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
