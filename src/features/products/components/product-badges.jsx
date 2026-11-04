function ProductBadges({ product }) {
  const badges = [];

  if (product.isNewArrival) {
    badges.push({
      key: "new",
      label: "New",
      className: "bg-ink text-white",
    });
  }

  if (product.isBestSeller) {
    badges.push({
      key: "best-seller",
      label: "Best Seller",
      className: "bg-mint text-ink",
    });
  }

  if (product.isFeatured) {
    badges.push({
      key: "featured",
      label: "Featured",
      className: "bg-coral text-white",
    });
  }

  if (!badges.length) {
    return null;
  }

  return (
    <div className="absolute left-3 right-14 top-3 z-10 flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.key}
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

export { ProductBadges };
