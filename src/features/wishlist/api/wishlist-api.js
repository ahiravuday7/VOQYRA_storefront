import { apiClient } from "@/lib/api-client";

const EMPTY_WISHLIST = {
  id: null,
  items: [],
  itemCount: 0,
};

function getWishlistFromResponse(response) {
  return response.data?.data?.wishlist ?? EMPTY_WISHLIST;
}

async function getWishlist({ signal } = {}) {
  const response = await apiClient.get("/wishlist", {
    signal,
  });

  return getWishlistFromResponse(response);
}

async function addWishlistItem({ productId }) {
  const response = await apiClient.post("/wishlist/items", {
    productId,
  });

  return getWishlistFromResponse(response);
}

async function removeWishlistItem({ productId }) {
  const response = await apiClient.delete(`/wishlist/items/${encodeURIComponent(productId)}`);

  return getWishlistFromResponse(response);
}

async function clearWishlist() {
  const response = await apiClient.delete("/wishlist");

  return getWishlistFromResponse(response);
}

export { addWishlistItem, clearWishlist, getWishlist, removeWishlistItem };
