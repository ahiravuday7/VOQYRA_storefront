function formatCurrency(value, { currency = "INR", locale = "en-IN" } = {}) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export { formatCurrency };
