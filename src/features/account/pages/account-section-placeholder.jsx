function AccountSectionPlaceholder({ eyebrow, title, description }) {
  return (
    <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">{eyebrow}</p>

      <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">{title}</h2>

      <p className="mt-3 max-w-xl text-sm leading-7 text-slate">{description}</p>
    </div>
  );
}

export { AccountSectionPlaceholder };
