import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/api/cart-api";
import { queryKeys } from "@/lib/query-keys";

function setCartData(queryClient, cart) {
  queryClient.setQueryData(queryKeys.cart.current(), cart);
}

function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,

    onSuccess: (cart) => {
      setCartData(queryClient, cart);
    },
  });
}

function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,

    onSuccess: (cart) => {
      setCartData(queryClient, cart);
    },
  });
}

function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,

    onSuccess: (cart) => {
      setCartData(queryClient, cart);
    },
  });
}

function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    onSuccess: (cart) => {
      setCartData(queryClient, cart);
    },
  });
}

export { useAddCartItem, useClearCart, useRemoveCartItem, useUpdateCartItem };
