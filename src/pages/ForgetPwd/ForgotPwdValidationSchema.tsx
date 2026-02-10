import z from "zod";

export const ForgotPwdSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type ForgotPwdForm = z.infer<typeof ForgotPwdSchema>;