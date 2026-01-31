import { z } from "zod";

export const ResetPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters"),
});

export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
