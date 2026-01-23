import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const SignupSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid email is required"),
  logo: z
    .any()
    .optional()
    .refine(
      (file) => !file || file instanceof File || typeof file === "string",
      { message: "Logo is required" }
    )
    .refine(
      (file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE,
      { message: `Logo must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` }
    )
    .refine(
      (file) =>
        !(file instanceof File) || ACCEPTED_IMAGE_TYPES.includes(file.type),
      { message: "Only JPEG, PNG, or WEBP are allowed" }
    ),
  companyType: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export type SignupForm = z.infer<typeof SignupSchema>;
