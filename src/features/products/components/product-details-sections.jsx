import { Link } from "react-router-dom";

function ProductDetailsSections({ product }) {
  return (
    <div className="mt-14 space-y-10 border-t border-cloud pt-10">
      {product.description && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Product details</h2>

          <p className="mt-4 leading-7 text-slate">{product.description}</p>
        </section>
      )}

      {product.attributes?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Details</h2>

          <dl className="mt-4 divide-y divide-cloud border-y border-cloud">
            {product.attributes.map((attribute) => (
              <div
                key={`${attribute.name}-${attribute.value}`}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <dt className="text-slate">{attribute.name}</dt>

                <dd className="font-medium text-right">{attribute.value}</dd>
              </div>
            ))}

            {product.countryOfOrigin && (
              <div className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-slate">Country of origin</dt>

                <dd className="font-medium">{product.countryOfOrigin}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {product.materials?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Materials</h2>

          <p className="mt-4 leading-7 text-slate">{product.materials.join(", ")}</p>
        </section>
      )}

      {product.careInstructions?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Care instructions</h2>

          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate">
            {product.careInstructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
        </section>
      )}

      {product.collections?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Collections</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collection/${collection.slug}`}
                className="rounded-full border border-cloud px-4 py-2 text-sm transition hover:border-ink"
              >
                {collection.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export { ProductDetailsSections };
