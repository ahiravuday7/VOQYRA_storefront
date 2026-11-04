import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

function EditorialHero() {
  return (
    <section className="overflow-hidden border-b border-cloud">
      <div className="mx-auto grid max-w-7xl lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Content */}
        <div className="motion-reveal flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
            VOQYRA / New season
          </p>

          <h1 className="mt-5 max-w-xl font-display text-6xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">
            Dress
            <br />
            beyond
            <br />
            ordinary.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-slate sm:text-lg">
            Contemporary clothing shaped by confident silhouettes, considered details and effortless
            everyday style.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="motion-button h-12 px-6">
              <Link to="/shop?isNewArrival=true">
                Shop new arrivals
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="motion-button h-12 px-6">
              <Link to="/collections">Explore collections</Link>
            </Button>
          </div>
        </div>

        {/* Editorial visual */}
        <div className="motion-reveal motion-delay-1 relative min-h-[520px] overflow-hidden bg-ink lg:min-h-full">
          <div className="absolute inset-6 border border-white/15 sm:inset-10" />

          <div className="absolute left-8 top-8 text-xs font-semibold uppercase tracking-[0.25em] text-white/60 sm:left-12 sm:top-12">
            AW / 26
          </div>

          <div className="absolute bottom-8 left-8 right-8 sm:bottom-12 sm:left-12 sm:right-12">
            <p className="max-w-md font-display text-4xl leading-tight text-white sm:text-5xl">
              Quiet confidence.
              <br />
              Bold presence.
            </p>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              An editorial space for the imagery and campaign photography we’ll connect later.
            </p>
          </div>

          <div className="absolute right-[-80px] top-[100px] size-[280px] rounded-full bg-coral opacity-80 sm:size-[360px]" />

          <div className="absolute bottom-[-100px] left-[20%] size-[300px] rounded-full bg-mint opacity-70 sm:size-[420px]" />
        </div>
      </div>
    </section>
  );
}

export { EditorialHero };
