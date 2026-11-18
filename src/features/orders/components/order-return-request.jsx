import { AlertTriangle, LoaderCircle, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  ORDER_RETURN_REASON_OPTIONS,
  ORDER_RETURN_RESOLUTION_OPTIONS,
} from "@/features/orders/constants/order-return-options";
import { useCreateReturnRequest } from "@/features/orders/hooks/use-create-return-request";
import { createOrderReturnSchema } from "@/features/orders/schemas/order-return-schema";

const RETURN_ELIGIBLE_STATUSES = new Set(["delivered", "refunded"]);

function isOrderReturnEligible(order) {
  if (!order) {
    return false;
  }

  return (
    RETURN_ELIGIBLE_STATUSES.has(order.status) &&
    Boolean(order.shipment?.deliveredAt) &&
    order.inventoryStatus === "committed" &&
    (order.items ?? []).length > 0
  );
}

function isItemReturnEligible(item) {
  const inventory = item.inventory;

  return (
    inventory?.status === "committed" &&
    inventory.reservedQuantity === 0 &&
    inventory.committedQuantity === item.quantity &&
    inventory.releasedQuantity === 0
  );
}

function getReturnErrorMessage(error) {
  switch (error?.code) {
    case "ORDER_RETURN_STATUS_INVALID":
      return "This order is not currently eligible for a return.";

    case "ORDER_RETURN_DELIVERY_STATE_INVALID":
      return "The order must be delivered before a return can be requested.";

    case "ORDER_RETURN_INVENTORY_STATE_INVALID":
      return "This order's inventory state does not allow a return.";

    case "ORDER_RETURN_ITEM_NOT_FOUND":
      return "One of the selected items no longer belongs to this order.";

    case "ORDER_RETURN_ITEM_STATE_INVALID":
      return "One of the selected items is no longer eligible for return.";

    case "ORDER_RETURN_DETAILS_REQUIRED":
      return "Please provide details when using the Other return reason.";

    case "ORDER_RETURN_QUANTITY_EXCEEDED": {
      const remainingQuantity = error?.details?.remainingQuantity;

      if (Number.isInteger(remainingQuantity)) {
        return `Only ${remainingQuantity} unit${
          remainingQuantity === 1 ? "" : "s"
        } of this item remain returnable.`;
      }

      return "The requested quantity exceeds the remaining returnable quantity.";
    }

    case "ORDER_RETURN_CONCURRENT_REQUEST":
      return "Another return request changed the available return quantity. Please review and try again.";

    case "ORDER_NOT_FOUND":
      return "The order could not be found in your account.";

    default:
      return error?.message ?? "Unable to create the return request.";
  }
}

function OrderReturnRequest({ order }) {
  const [open, setOpen] = useState(false);

  const createReturnMutation = useCreateReturnRequest();

  const defaultValues = useMemo(
    () => ({
      requestedResolution: "refund",

      items: (order.items ?? []).map((item) => ({
        selected: false,

        orderItemId: item.id,

        quantity: 1,

        reason: "",

        details: "",
      })),

      customerNote: "",
    }),
    [order.items],
  );

  const schema = useMemo(() => createOrderReturnSchema(order.items ?? []), [order.items]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues,
  });

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? defaultValues.items;

  const eligible = isOrderReturnEligible(order);

  if (!eligible) {
    return null;
  }

  const eligibleItems = (order.items ?? []).filter(isItemReturnEligible);

  if (eligibleItems.length === 0) {
    return null;
  }

  const handleOpenChange = (nextOpen) => {
    if (createReturnMutation.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      reset(defaultValues);

      createReturnMutation.reset();
    }
  };

  const onSubmit = async (values) => {
    const selectedItems = values.items
      .filter((item) => item.selected)
      .map((item) => {
        const details = item.details?.trim();

        return {
          orderItemId: item.orderItemId,

          quantity: Number(item.quantity),

          reason: item.reason,

          ...(details
            ? {
                details,
              }
            : {}),
        };
      });

    const customerNote = values.customerNote?.trim();

    const returnData = {
      requestedResolution: values.requestedResolution,

      items: selectedItems,

      ...(customerNote
        ? {
            customerNote,
          }
        : {}),
    };

    try {
      const returnRequest = await createReturnMutation.mutateAsync({
        orderId: order.id,

        returnData,
      });

      toast.success(`Return request ${returnRequest.returnRequestNumber} submitted.`);

      reset(defaultValues);

      setOpen(false);
    } catch (error) {
      toast.error(getReturnErrorMessage(error));
    }
  };

  const selectionError = errors.items?.root?.message ?? errors.items?.message;

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 border-t border-cloud pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Need to return something?</p>

          <p className="mt-1 text-xs leading-5 text-slate">
            Select the delivered items you want to return.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Start a return
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create a return request</DialogTitle>

              <DialogDescription>
                Choose the items you want to return from{" "}
                <span className="font-semibold text-foreground">{order.orderNumber}</span>.
              </DialogDescription>
            </DialogHeader>

            {/* Resolution */}
            <section className="mt-6">
              <Label>What would you prefer?</Label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {ORDER_RETURN_RESOLUTION_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer gap-3 rounded-lg border border-cloud p-4 has-[:checked]:border-ink"
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="mt-1"
                      {...register("requestedResolution")}
                    />

                    <div>
                      <p className="text-sm font-semibold">{option.label}</p>

                      <p className="mt-1 text-xs leading-5 text-slate">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Items */}
            <section className="mt-7">
              <Label>Select items</Label>

              <div className="mt-3 space-y-4">
                {order.items.map((item, index) => {
                  const itemEligible = isItemReturnEligible(item);

                  const selected = watchedItems?.[index]?.selected === true;

                  const selectedReason = watchedItems?.[index]?.reason;

                  return (
                    <div key={item.id} className="rounded-xl border border-cloud p-4">
                      <input type="hidden" {...register(`items.${index}.orderItemId`)} />

                      <div className="flex gap-4">
                        <input
                          type="checkbox"
                          className="mt-2 size-4 shrink-0"
                          disabled={!itemEligible}
                          {...register(`items.${index}.selected`)}
                        />

                        <ImageWithFallback
                          src={item.image?.url}
                          alt={item.image?.altText ?? item.productName}
                          className="size-20 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{item.productName}</p>

                          <p className="mt-1 text-xs text-slate">
                            {[
                              item.size ? `Size ${item.size}` : null,

                              item.color?.name ?? null,

                              `Purchased ${item.quantity}`,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          {!itemEligible && (
                            <p className="mt-2 text-xs text-destructive">
                              This item is not in a returnable inventory state.
                            </p>
                          )}
                        </div>
                      </div>

                      {selected && (
                        <div className="mt-5 grid gap-4 border-t border-cloud pt-5 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`returnQuantity-${item.id}`}>Quantity</Label>

                            <Input
                              id={`returnQuantity-${item.id}`}
                              type="number"
                              min={1}
                              max={item.quantity}
                              {...register(`items.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                            />

                            {errors.items?.[index]?.quantity && (
                              <p className="text-sm text-destructive">
                                {errors.items[index].quantity.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Reason</Label>

                            <Controller
                              control={control}
                              name={`items.${index}.reason`}
                              render={({ field }) => (
                                <Select
                                  value={field.value || undefined}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-10 w-full">
                                    <SelectValue placeholder="Choose reason" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {ORDER_RETURN_REASON_OPTIONS.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {errors.items?.[index]?.reason && (
                              <p className="text-sm text-destructive">
                                {errors.items[index].reason.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <div className="flex justify-between gap-3">
                              <Label htmlFor={`returnDetails-${item.id}`}>
                                Details
                                {selectedReason !== "other" && (
                                  <span className="text-slate"> (optional)</span>
                                )}
                              </Label>

                              <span className="text-xs text-slate">
                                {watchedItems?.[index]?.details?.length ?? 0}
                                /500
                              </span>
                            </div>

                            <Textarea
                              id={`returnDetails-${item.id}`}
                              rows={3}
                              maxLength={500}
                              placeholder="Tell us what happened with this item."
                              {...register(`items.${index}.details`)}
                            />

                            {errors.items?.[index]?.details && (
                              <p className="text-sm text-destructive">
                                {errors.items[index].details.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectionError && <p className="mt-3 text-sm text-destructive">{selectionError}</p>}

              <div className="mt-4 flex gap-3 rounded-lg bg-cloud/30 p-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-slate" aria-hidden="true" />

                <p className="text-xs leading-5 text-slate">
                  Previous active return requests may have already consumed part of an item's
                  returnable quantity. The backend verifies the remaining quantity again when you
                  submit.
                </p>
              </div>
            </section>

            {/* Note */}
            <section className="mt-7">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="returnCustomerNote">
                  Additional note <span className="text-slate">(optional)</span>
                </Label>
              </div>

              <Textarea
                id="returnCustomerNote"
                rows={3}
                maxLength={1000}
                className="mt-2"
                placeholder="Anything else you'd like us to know?"
                {...register("customerNote")}
              />

              {errors.customerNote && (
                <p className="mt-2 text-sm text-destructive">{errors.customerNote.message}</p>
              )}
            </section>

            {createReturnMutation.isError && (
              <div className="mt-5 rounded-lg bg-coral/10 p-4">
                <p className="text-sm leading-6 text-coral">
                  {getReturnErrorMessage(createReturnMutation.error)}
                </p>
              </div>
            )}

            <DialogFooter className="mt-7">
              <Button
                type="button"
                variant="outline"
                disabled={createReturnMutation.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>

              <Button type="submit" disabled={createReturnMutation.isPending}>
                {createReturnMutation.isPending ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Submit return
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

export { OrderReturnRequest };
