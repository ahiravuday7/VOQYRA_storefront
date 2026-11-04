import { create } from "zustand";

const CHECKOUT_STEPS = {
  DETAILS: "details",
  REVIEW: "review",
};

const useCheckoutStore = create((set) => ({
  step: CHECKOUT_STEPS.DETAILS,

  setStep: (step) =>
    set({
      step,
    }),

  resetCheckout: () =>
    set({
      step: CHECKOUT_STEPS.DETAILS,
    }),
}));

export { CHECKOUT_STEPS, useCheckoutStore };
