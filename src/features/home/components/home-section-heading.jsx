import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function HomeSectionHeading({ eyebrow, title, description, linkLabel, linkTo }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">{eyebrow}</p>
        )}

        <h2 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {title}
        </h2>

        {description && <p className="mt-3 max-w-xl leading-7 text-slate">{description}</p>}
      </div>

      {linkLabel && linkTo && (
        <Link to={linkTo} className="group inline-flex items-center gap-2 text-sm font-semibold">
          {linkLabel}

          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}

export { HomeSectionHeading };
