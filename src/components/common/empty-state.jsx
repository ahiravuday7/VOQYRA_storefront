function EmptyState({ title, description, action = null }) {
  return (
    <section className="flex min-h-64 flex-col items-center justify-center border border-dashed border-cloud px-6 py-12 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>

      {description && <p className="mt-2 max-w-md text-sm leading-6 text-slate">{description}</p>}

      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}

export { EmptyState };
