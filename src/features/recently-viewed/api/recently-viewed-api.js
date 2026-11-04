import { apiClient } from "@/lib/api-client";

const EMPTY_RECENTLY_VIEWED = {
  id: null,
  items: [],
  itemCount: 0,
};

function getRecentlyViewedFromResponse(response) {
  return response.data?.data?.recentlyViewed ?? EMPTY_RECENTLY_VIEWED;
}

async function getRecentlyViewed({ signal } = {}) {
  const response = await apiClient.get("/recently-viewed", {
    signal,
  });

  return getRecentlyViewedFromResponse(response);
}

async function recordRecentlyViewed({ productId }) {
  const response = await apiClient.post(`/recently-viewed/${encodeURIComponent(productId)}`);

  return getRecentlyViewedFromResponse(response);
}

async function removeRecentlyViewedItem({ productId }) {
  const response = await apiClient.delete(`/recently-viewed/${encodeURIComponent(productId)}`);

  return getRecentlyViewedFromResponse(response);
}

async function clearRecentlyViewed() {
  const response = await apiClient.delete("/recently-viewed");

  return getRecentlyViewedFromResponse(response);
}

export { clearRecentlyViewed, getRecentlyViewed, recordRecentlyViewed, removeRecentlyViewedItem };
