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
}));

export { useStorefrontUiStore };
