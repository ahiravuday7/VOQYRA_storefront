import { formatCurrency } from "@/utils/format-currency";

function Currency({ value, currency = "INR", locale = "en-IN", className }) {
  return (
    <span className={className}>
      {formatCurrency(value, {
        currency,
        locale,
      })}
    </span>
  );
}

export { Currency };
