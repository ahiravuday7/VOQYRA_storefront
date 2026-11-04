import { Ruler } from "lucide-react";
import { useState } from "react";

import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SizeGuideTable } from "@/features/size-guides/components/size-guide-table";
import { useSizeGuide } from "@/features/size-guides/hooks/use-size-guide";

function SizeGuideSheet({ slug, trigger = null }) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeGuideQuery = useSizeGuide(slug, {
    enabled: isOpen && Boolean(slug),
  });

  const sizeGuide = sizeGuideQuery.data;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" disabled={!slug}>
            <Ruler className="size-4" aria-hidden="true" />
            Size guide
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full overflow-y-auto bg-porcelain sm:max-w-xl">
        <SheetHeader className="border-b border-cloud pb-5 text-left">
          <SheetTitle className="font-display text-3xl font-semibold">
            {sizeGuide?.name ?? "Size guide"}
          </SheetTitle>

          <SheetDescription>
            {sizeGuide?.description ?? "Find the right size using the measurements below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          {sizeGuideQuery.isPending && <LoadingSkeleton rows={4} />}

          {sizeGuideQuery.isError && (
            <ErrorState
              title="Size guide unavailable."
              description={sizeGuideQuery.error?.message ?? "We couldn't load this size guide."}
              onRetry={() => sizeGuideQuery.refetch()}
            />
          )}

          {sizeGuideQuery.isSuccess && !sizeGuide && (
            <p className="text-sm text-slate">This size guide is not available.</p>
          )}

          {sizeGuide && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-cloud pb-4">
                <span className="text-sm font-medium">Measurements</span>

                <span className="rounded-full bg-cloud/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate">
                  {sizeGuide.unit}
                </span>
              </div>

              <SizeGuideTable sizeGuide={sizeGuide} />

              {sizeGuide.howToMeasure && (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
                    How to measure
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate">{sizeGuide.howToMeasure}</p>
                </section>
              )}

              {sizeGuide.fitNote && (
                <section className="rounded-lg bg-mint/40 p-5">
                  <h3 className="text-sm font-semibold">Fit note</h3>

                  <p className="mt-2 text-sm leading-6 text-ink/70">{sizeGuide.fitNote}</p>
                </section>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { SizeGuideSheet };
