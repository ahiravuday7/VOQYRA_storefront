import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { useAddCartItem } from "@/features/cart/hooks/use-cart-mutations";
import { useCart } from "@/features/cart/hooks/use-cart";

function useCartManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);

  const isCustomer = Boolean(user) && user.role === "customer";

  const cartQuery = useCart({
    enabled: isCustomer,
  });

  const addMutation = useAddCartItem();

  const addToCart = async ({ product, variant, quantity }) => {
    if (!isCustomer) {
      toast.info("Sign in to add products to your bag.");

      navigate("/login", {
        state: {
          from: location,
        },
      });

      return false;
    }

    if (!product?.id || !variant?.id) {
      toast.error("Please select a valid product option.");

      return false;
    }

    try {
      await addMutation.mutateAsync({
        productId: product.id,
        variantId: variant.id,
        quantity,
      });

      toast.success(`${product.name} added to your bag.`);

      return true;
    } catch (error) {
      toast.error(error?.message ?? "Unable to add this product to your bag.");

      return false;
    }
  };

  return {
    addMutation,
    addToCart,
    cart: cartQuery.data ?? null,
    cartQuery,
    isCustomer,
  };
}

export { useCartManager };
