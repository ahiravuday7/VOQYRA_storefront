import { formatCurrency } from "@/utils/format-currency";

function formatProductMoney(value, currency = "INR") {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return formatCurrency(numericValue, {
    currency,
  });
}

function formatProductPriceRange(priceRange) {
  if (!priceRange) {
    return "—";
  }

  const { minimum, maximum, currency = "INR" } = priceRange;

  const minimumPrice = Number(minimum);

  const maximumPrice = Number(maximum);

  if (!Number.isFinite(minimumPrice) || !Number.isFinite(maximumPrice)) {
    return "—";
  }

  if (minimumPrice === maximumPrice) {
    return formatProductMoney(minimumPrice, currency);
  }

  return `${formatProductMoney(minimumPrice, currency)} – ${formatProductMoney(
    maximumPrice,
    currency,
  )}`;
}

export { formatProductMoney, formatProductPriceRange };
