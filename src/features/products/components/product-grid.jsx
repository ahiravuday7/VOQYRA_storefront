import { ProductCard } from "@/features/products/components/product-card";
import { useWishlistManager } from "@/features/wishlist/hooks/use-wishlist-manager";

function ProductGrid({ products = [], onQuickShop }) {
  const { isPendingFor, toggleWishlist, wishlistedProductIds } = useWishlistManager();

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onWishlistClick={toggleWishlist}
          onQuickShop={onQuickShop}
          isWishlisted={wishlistedProductIds.has(product.id)}
          isWishlistPending={isPendingFor(product.id)}
        />
      ))}
    </div>
  );
}

export { ProductGrid };
