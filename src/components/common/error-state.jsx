import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

function ErrorState({
  title = "Something went wrong.",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}) {
  return (
    <section
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-coral/10">
        <CircleAlert className="size-6 text-coral" />
      </div>

      <h2 className="mt-5 text-xl font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate">{description}</p>

      {onRetry && (
        <Button type="button" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </section>
  );
}

export { ErrorState };
