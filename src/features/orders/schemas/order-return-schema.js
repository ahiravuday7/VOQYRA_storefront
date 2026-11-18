import { z } from "zod";

import {
  ORDER_RETURN_REASON_VALUES,
  ORDER_RETURN_RESOLUTION_VALUES,
} from "@/features/orders/constants/order-return-options";

function createOrderReturnSchema(orderItems = []) {
  const purchasedQuantityByItemId = new Map(
    orderItems.map((item) => [item.id, Number(item.quantity ?? 0)]),
  );

  return z
    .object({
      requestedResolution: z.enum(ORDER_RETURN_RESOLUTION_VALUES),

      items: z.array(
        z.object({
          selected: z.boolean(),

          orderItemId: z.string().min(1),

          quantity: z.coerce.number(),

          reason: z.string(),

          details: z.string().trim().max(500, {
            error: "Return details cannot exceed 500 characters.",
          }),
        }),
      ),

      customerNote: z.string().trim().max(1000, {
        error: "Return note cannot exceed 1000 characters.",
      }),
    })
    .superRefine((values, context) => {
      const selectedItems = values.items.filter((item) => item.selected);

      if (selectedItems.length === 0) {
        context.addIssue({
          code: "custom",
          path: ["items"],
          message: "Select at least one item to return.",
        });

        return;
      }

      values.items.forEach((item, index) => {
        if (!item.selected) {
          return;
        }

        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          context.addIssue({
            code: "custom",
            path: ["items", index, "quantity"],
            message: "Return quantity must be at least 1.",
          });
        }

        const purchasedQuantity = purchasedQuantityByItemId.get(item.orderItemId) ?? 0;

        if (item.quantity > purchasedQuantity) {
          context.addIssue({
            code: "custom",
            path: ["items", index, "quantity"],
            message: `You purchased ${purchasedQuantity} of this item.`,
          });
        }

        if (!ORDER_RETURN_REASON_VALUES.includes(item.reason)) {
          context.addIssue({
            code: "custom",
            path: ["items", index, "reason"],
            message: "Choose a return reason.",
          });
        }

        if (item.reason === "other" && !item.details?.trim()) {
          context.addIssue({
            code: "custom",
            path: ["items", index, "details"],
            message: "Please describe the return reason.",
          });
        }
      });
    });
}

export { createOrderReturnSchema };
