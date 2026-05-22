import z from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[!@#$%^&*]/, "Must contain special character (!@#$%^&*)");

export const credentialsSchema = z.object({
  email: z.string().email("Invalid email"),
  password: passwordSchema,
});
