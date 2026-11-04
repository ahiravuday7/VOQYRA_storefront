import { z } from "zod";

const PHONE_NUMBER_PATTERN = /^\+?[1-9][0-9]{9,14}$/;

const INDIAN_POSTAL_CODE_PATTERN = /^[1-9][0-9]{5}$/;

function emptyStringToUndefined(value) {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim();

  return normalizedValue === "" ? undefined : normalizedValue;
}

function normalizePhone(value) {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim().replace(/[\s()-]/g, "");

  return normalizedValue === "" ? undefined : normalizedValue;
}

const requiredPhoneSchema = z.preprocess(
  normalizePhone,
  z
    .string({
      error: "Phone number is required.",
    })
    .regex(PHONE_NUMBER_PATTERN, {
      error: "Enter a valid phone number.",
    }),
);

const optionalPhoneSchema = z.preprocess(
  normalizePhone,
  z
    .string()
    .regex(PHONE_NUMBER_PATTERN, {
      error: "Enter a valid alternate phone number.",
    })
    .optional(),
);

const optionalEmailSchema = z.preprocess(
  emptyStringToUndefined,
  z
    .string()
    .email({
      error: "Enter a valid email address.",
    })
    .max(254, {
      error: "Email cannot exceed 254 characters.",
    })
    .optional(),
);

const optionalTextSchema = (maximum, message) =>
  z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(maximum, {
        error: message,
      })
      .optional(),
  );

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, {
        error: "Full name must contain at least 2 characters.",
      })
      .max(150, {
        error: "Full name cannot exceed 150 characters.",
      }),

    phone: requiredPhoneSchema,

    alternatePhone: optionalPhoneSchema,

    email: optionalEmailSchema,

    addressLine1: z
      .string()
      .trim()
      .min(5, {
        error: "Address must contain at least 5 characters.",
      })
      .max(250, {
        error: "Address cannot exceed 250 characters.",
      }),

    addressLine2: optionalTextSchema(250, "Address line 2 cannot exceed 250 characters."),

    landmark: optionalTextSchema(150, "Landmark cannot exceed 150 characters."),

    city: z
      .string()
      .trim()
      .min(2, {
        error: "City must contain at least 2 characters.",
      })
      .max(100, {
        error: "City cannot exceed 100 characters.",
      }),

    state: z
      .string()
      .trim()
      .min(2, {
        error: "State must contain at least 2 characters.",
      })
      .max(100, {
        error: "State cannot exceed 100 characters.",
      }),

    postalCode: z.string().trim().regex(INDIAN_POSTAL_CODE_PATTERN, {
      error: "Enter a valid 6-digit Indian PIN code.",
    }),

    country: z.literal("India", {
      error: "Shipping country must be India.",
    }),
  }),

  paymentMethod: z.enum(["cash-on-delivery", "online"]),

  customerNote: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(500, {
        error: "Order note cannot exceed 500 characters.",
      })
      .optional(),
  ),
});

export { checkoutSchema };
