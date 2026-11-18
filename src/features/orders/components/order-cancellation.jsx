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

import { useCancelOrder } from "@/features/orders/hooks/use-cancel-order";
import { orderCancellationSchema } from "@/features/orders/schemas/order-cancellation-schema";

const CANCELLABLE_ORDER_STATUSES = new Set(["pending", "confirmed"]);

const CANCELLABLE_PAYMENT_STATUSES = new Set(["pending", "failed"]);

const REFUND_REQUIRED_STATUSES = new Set(["paid", "partially-refunded", "refunded"]);

function canCancelOrder(order) {
  if (!order) {
    return false;
  }

  if (!CANCELLABLE_ORDER_STATUSES.has(order.status)) {
    return false;
  }

  if (!CANCELLABLE_PAYMENT_STATUSES.has(order.payment?.status)) {
    return false;
  }

  if (order.inventoryStatus !== "reserved") {
    return false;
  }

  const items = order.items ?? [];

  if (items.length === 0) {
    return false;
  }

  return items.every((item) => {
    const inventory = item.inventory;

    return (
      inventory?.status === "reserved" &&
      inventory.reservedQuantity === item.quantity &&
      inventory.committedQuantity === 0 &&
      inventory.releasedQuantity === 0
    );
  });
}

function getCancellationUnavailableMessage(order) {
  if (order.status === "cancelled") {
    return "This order has already been cancelled.";
  }

  if (REFUND_REQUIRED_STATUSES.has(order.payment?.status)) {
    return "This paid order cannot be cancelled directly. A refund workflow is required.";
  }

  if (!CANCELLABLE_ORDER_STATUSES.has(order.status)) {
    return "Cancellation is no longer available after order processing has started.";
  }

  if (order.inventoryStatus !== "reserved") {
    return "This order's inventory is no longer in a cancellable reservation state.";
  }

  return "This order cannot currently be cancelled.";
}

function getCancellationErrorMessage(error) {
  switch (error?.code) {
    case "ORDER_CANCELLATION_REQUIRES_REFUND":
      return "This paid order requires a refund workflow and cannot be cancelled directly.";

    case "ORDER_CANCELLATION_NOT_ALLOWED":
      return "This order can no longer be cancelled.";

    case "ORDER_INVENTORY_RELEASE_STATE_INVALID":
      return "The order inventory is no longer in a state that can be cancelled.";

    case "ORDER_INVENTORY_RELEASE_CONFLICT":
      return "The order changed while cancellation was being processed. Please review the latest order status.";

    default:
      return error?.message ?? "Unable to cancel this order.";
  }
}

function OrderCancellation({ order }) {
  const [open, setOpen] = useState(false);

  const cancellationMutation = useCancelOrder();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderCancellationSchema),

    defaultValues: {
      reason: "",
    },
  });

  const reason =
    useWatch({
      control,
      name: "reason",
    }) ?? "";

  const cancellable = canCancelOrder(order);

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
        orderId: order.id,

        reason: values.reason.trim(),
      });

      toast.success("Order cancelled successfully.");

      reset({
        reason: "",
      });

      setOpen(false);
    } catch (error) {
      toast.error(getCancellationErrorMessage(error));
    }
  };

  if (!cancellable) {
    return (
      <div className="mt-6 flex gap-3 rounded-lg bg-cloud/30 p-4">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-slate" aria-hidden="true" />

        <div>
          <p className="text-sm font-semibold">Cancellation unavailable</p>

          <p className="mt-1 text-xs leading-5 text-slate">
            {getCancellationUnavailableMessage(order)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 border-t border-cloud pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Need to cancel?</p>

          <p className="mt-1 text-xs leading-5 text-slate">
            Cancellation releases the reserved inventory back to availability.
          </p>
        </div>

        <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
          <XCircle className="size-4" aria-hidden="true" />
          Cancel order
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Cancel this order?</DialogTitle>

              <DialogDescription>
                This action will cancel order{" "}
                <span className="font-semibold text-foreground">{order.orderNumber}</span> and
                release its reserved inventory.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <div className="rounded-lg bg-coral/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-coral" aria-hidden="true" />

                  <p className="text-sm leading-6 text-coral">
                    Once cancelled, this order cannot be restored from the storefront.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="cancellationReason">Reason for cancellation</Label>

                  <span className="text-xs text-slate">{reason.length}/500</span>
                </div>

                <Textarea
                  id="cancellationReason"
                  rows={5}
                  maxLength={500}
                  placeholder="Example: I selected the wrong size."
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
                Keep order
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

export { OrderCancellation };
