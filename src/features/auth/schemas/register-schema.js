import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),

    lastName: z.string().trim().min(1, "Last name is required."),

    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),

    phone: z
      .union([
        z.literal(""),
        z
          .string()
          .trim()
          .regex(
            /^\+[1-9]\d{7,14}$/,
            "Enter phone number in international format, for example +919876543210.",
          ),
      ])
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(72, "Password must not exceed 72 characters.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export { registerSchema };
