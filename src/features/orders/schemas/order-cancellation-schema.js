import { z } from "zod";

const orderCancellationSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, {
      error: "Cancellation reason must contain at least 5 characters.",
    })
    .max(500, {
      error: "Cancellation reason cannot exceed 500 characters.",
    }),
});

export { orderCancellationSchema };
