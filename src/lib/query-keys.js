const queryKeys = {
  auth: {
    all: ["auth"],
    me: () => ["auth", "me"],
  },

  categories: {
    all: ["categories"],
    list: (params = {}) => ["categories", "list", params],
    tree: () => ["categories", "tree"],
    detail: (slug) => ["categories", "detail", slug],
  },

  brands: {
    all: ["brands"],
    list: (params = {}) => ["brands", "list", params],
    detail: (slug) => ["brands", "detail", slug],
  },

  collections: {
    all: ["collections"],
    list: (params = {}) => ["collections", "list", params],
    detail: (slug) => ["collections", "detail", slug],
  },

  sizeGuides: {
    all: ["size-guides"],
    list: () => ["size-guides", "list"],
    detail: (slug) => ["size-guides", "detail", slug],
  },

  products: {
    all: ["products"],
    list: (params = {}) => ["products", "list", params],
    detail: (slug) => ["products", "detail", slug],
  },

  cart: {
    all: ["cart"],
    current: () => ["cart", "current"],
  },

  wishlist: {
    all: ["wishlist"],
    current: () => ["wishlist", "current"],
  },

  recentlyViewed: {
    all: ["recently-viewed"],
    current: () => ["recently-viewed", "current"],
  },

  orders: {
    all: ["orders"],
    list: (params = {}) => ["orders", "list", params],
    detail: (orderId) => ["orders", "detail", orderId],
    returns: () => ["orders", "returns"],
    returnDetail: (returnRequestId) => ["orders", "returns", "detail", returnRequestId],
    replacements: () => ["orders", "replacements"],
    replacementDetail: (replacementId) => ["orders", "replacements", "detail", replacementId],
  },
};

export { queryKeys };
