import { AlertTriangle, LoaderCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCancelReturnRequest } from "@/features/orders/hooks/use-cancel-return-request";
import { returnRequestCancellationSchema } from "@/features/orders/schemas/return-request-cancellation-schema";

const CANCELLABLE_RETURN_STATUSES = new Set(["requested", "approved"]);

function physicalProcessingHasStarted(returnRequest) {
  if (
    returnRequest.shipment?.markedInTransitAt ||
    returnRequest.receipt?.receivedAt ||
    returnRequest.completion?.completedAt
  ) {
    return true;
  }

  return (returnRequest.items ?? []).some((item) => Boolean(item.inspection?.inspectedAt));
}

function canCancelReturnRequest(returnRequest) {
  return (
    CANCELLABLE_RETURN_STATUSES.has(returnRequest.status) &&
    !physicalProcessingHasStarted(returnRequest)
  );
}

function getCancellationErrorMessage(error) {
  switch (error?.code) {
    case "ORDER_RETURN_CANCELLATION_STATUS_INVALID":
      return "This return request can no longer be cancelled.";

    case "ORDER_RETURN_CANCELLATION_STATE_INVALID":
      return "Physical return processing has already started, so this request can no longer be cancelled.";

    case "ORDER_RETURN_ORDER_STATE_INVALID":
      return "The linked order is no longer in a valid state for this cancellation.";

    case "ORDER_RETURN_CONCURRENT_REQUEST":
      return "The return request changed while cancellation was being processed. Please review the latest status.";

    case "ORDER_RETURN_REQUEST_NOT_FOUND":
      return "The return request could not be found in your account.";

    default:
      return error?.message ?? "Unable to cancel the return request.";
  }
}

function ReturnRequestCancellation({ returnRequest }) {
  const [open, setOpen] = useState(false);

  const cancellationMutation = useCancelReturnRequest();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(returnRequestCancellationSchema),

    defaultValues: {
      reason: "",
    },
  });

  const reason =
    useWatch({
      control,
      name: "reason",
    }) ?? "";

  const cancellable = canCancelReturnRequest(returnRequest);

  if (!cancellable) {
    return null;
  }

  const handleOpenChange = (nextOpen) => {
    if (cancellationMutation.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      reset({
        reason: "",
      });

      cancellationMutation.reset();
    }
  };

  const onSubmit = async (values) => {
    try {
      await cancellationMutation.mutateAsync({
        returnRequestId: returnRequest.id,

        reason: values.reason.trim(),
      });

      toast.success("Return request cancelled successfully.");

      reset({
        reason: "",
      });

      setOpen(false);
    } catch (error) {
      toast.error(getCancellationErrorMessage(error));
    }
  };

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 border-t border-cloud pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Changed your mind?</p>

          <p className="mt-1 text-xs leading-5 text-slate">
            You can cancel this return before physical processing starts.
          </p>
        </div>

        <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
          <XCircle className="size-4" aria-hidden="true" />
          Cancel return
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Cancel this return?</DialogTitle>

              <DialogDescription>
                You are cancelling{" "}
                <span className="font-semibold text-foreground">
                  {returnRequest.returnRequestNumber}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <div className="flex gap-3 rounded-lg bg-coral/10 p-4">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-coral" aria-hidden="true" />

                <p className="text-sm leading-6 text-coral">
                  Cancelling releases the quantity consumed by this return request, so it may become
                  returnable again.
                </p>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="returnCancellationReason">Reason</Label>

                  <span className="text-xs text-slate">{reason.length}/500</span>
                </div>

                <Textarea
                  id="returnCancellationReason"
                  rows={4}
                  maxLength={500}
                  placeholder="Example: I no longer want to return this item."
                  aria-invalid={Boolean(errors.reason)}
                  {...register("reason")}
                />

                {errors.reason && (
                  <p className="text-sm text-destructive">{errors.reason.message}</p>
                )}
              </div>

              {cancellationMutation.isError && (
                <div className="mt-4 rounded-lg bg-coral/10 p-4">
                  <p className="text-sm leading-6 text-coral">
                    {getCancellationErrorMessage(cancellationMutation.error)}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={cancellationMutation.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Keep return
              </Button>

              <Button type="submit" variant="destructive" disabled={cancellationMutation.isPending}>
                {cancellationMutation.isPending ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" aria-hidden="true" />
                    Confirm cancellation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ReturnRequestCancellation };
