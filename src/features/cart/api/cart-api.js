import { apiClient } from "@/lib/api-client";

const EMPTY_CART = {
  id: null,
  items: [],
  itemCount: 0,
  totalQuantity: 0,
  summary: {
    subtotal: 0,
    currency: "INR",
  },
};

function getCartFromResponse(response) {
  return response.data?.data?.cart ?? EMPTY_CART;
}

async function getCart({ signal } = {}) {
  const response = await apiClient.get("/cart", {
    signal,
  });

  return getCartFromResponse(response);
}

async function addCartItem({ productId, variantId, quantity }) {
  const response = await apiClient.post("/cart/items", {
    productId,
    variantId,
    quantity,
  });

  return getCartFromResponse(response);
}

async function updateCartItem({ itemId, quantity }) {
  const response = await apiClient.patch(`/cart/items/${encodeURIComponent(itemId)}`, {
    quantity,
  });

  return getCartFromResponse(response);
}

async function removeCartItem({ itemId }) {
  const response = await apiClient.delete(`/cart/items/${encodeURIComponent(itemId)}`);

  return getCartFromResponse(response);
}

async function clearCart() {
  const response = await apiClient.delete("/cart");

  return getCartFromResponse(response);
}

export { addCartItem, clearCart, getCart, removeCartItem, updateCartItem };
