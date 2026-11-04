import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ImageWithFallback } from "@/components/common/image-with-fallback";

function CollectionCard({ collection }) {
  const bannerUrl = collection.banner?.url ?? "";

  const bannerAlt = collection.banner?.altText || collection.name;

  return (
    <Link to={`/collection/${collection.slug}`} className="group block">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-cloud/30">
        <ImageWithFallback
          src={bannerUrl}
          alt={bannerAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{collection.name}</h3>

          {collection.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate">
              {collection.description}
            </p>
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

export { CollectionCard };
