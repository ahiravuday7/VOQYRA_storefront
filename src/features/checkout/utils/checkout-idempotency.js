function createCheckoutIdempotencyKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `checkout:${crypto.randomUUID()}`;
  }

  return `checkout:${Date.now()}:` + Math.random().toString(36).slice(2);
}

export { createCheckoutIdempotencyKey };
