import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ImageWithFallback } from "@/components/common/image-with-fallback";

function CategoryCard({ category }) {
  const imageUrl = category.image?.url || category.bannerImage?.url || "";

  const altText = category.image?.altText || category.bannerImage?.altText || category.name;

  return (
    <Link to={`/category/${category.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-cloud/30">
        <ImageWithFallback
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{category.name}</h3>

          {category.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate">{category.description}</p>
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

export { CategoryCard };
