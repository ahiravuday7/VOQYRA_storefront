import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ImageWithFallback } from "@/components/common/image-with-fallback";

function BrandCard({ brand }) {
  const logoUrl = brand.logo?.url ?? "";

  const logoAlt = brand.logo?.altText || `${brand.name} logo`;

  return (
    <Link to={`/brand/${brand.slug}`} className="group block">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-cloud bg-soft-white p-8">
        <ImageWithFallback
          src={logoUrl}
          alt={logoAlt}
          className="max-h-24 w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{brand.name}</h3>

          {brand.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate">{brand.description}</p>
          )}
        </div>

        <ArrowUpRight
          className="mt-1 size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export { BrandCard };
