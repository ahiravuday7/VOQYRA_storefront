import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function Breadcrumbs({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="size-4 text-slate/60" aria-hidden="true" />}

            {isLast || !item.to ? (
              <span
                className={isLast ? "font-medium text-ink" : undefined}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export { Breadcrumbs };
