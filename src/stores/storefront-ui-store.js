import { create } from "zustand";

const useStorefrontUiStore = create((set) => ({
  isCartDrawerOpen: false,
  isSearchOpen: false,

  openCartDrawer: () =>
    set({
      isCartDrawerOpen: true,
    }),

  closeCartDrawer: () =>
    set({
      isCartDrawerOpen: false,
    }),

  setCartDrawerOpen: (isOpen) =>
    set({
      isCartDrawerOpen: isOpen,
    }),

  openSearch: () =>
    set({
      isSearchOpen: true,
    }),

  closeSearch: () =>
    set({
      isSearchOpen: false,
    }),

  setSearchOpen: (isOpen) =>
    set({
      isSearchOpen: isOpen,
    }),

  isProductFilterOpen: false,

  openProductFilter: () =>
    set({
      isProductFilterOpen: true,
    }),

  closeProductFilter: () =>
    set({
      isProductFilterOpen: false,
    }),

  setProductFilterOpen: (isOpen) =>
    set({
      isProductFilterOpen: isOpen,
    }),

  isQuickShopOpen: false,
  quickShopSlug: null,

  openQuickShop: (slug) =>
    set({
      isQuickShopOpen: true,
      quickShopSlug: slug,
    }),

  closeQuickShop: () =>
    set({
      isQuickShopOpen: false,
      quickShopSlug: null,
    }),

  setQuickShopOpen: (isOpen) =>
    set((state) => ({
      isQuickShopOpen: isOpen,
      quickShopSlug: isOpen ? state.quickShopSlug : null,
    })),
}));

export { useStorefrontUiStore };
