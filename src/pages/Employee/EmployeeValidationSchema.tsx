import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const checkFileSize = () => ({
  message: `Image must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
});

const checkFileType = () => ({
  message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
});

export const EmployeeCreateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),

  email: z.string().email("Valid email is required"),

  profilePic: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file || file instanceof File || typeof file === "string",
      { message: "Invalid image file" }
    )
    .refine(
      (file) =>
        !(file instanceof File) || file.size <= MAX_FILE_SIZE,
      checkFileSize()
    )
    .refine(
      (file) =>
        !(file instanceof File) ||
        ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
      checkFileType()
    ),

  position: z.string().max(100, "Position must be less than 100 characters").optional(),

  phone: z
    .string()
    .min(6, "Phone number is required")
    .max(20, "Phone number is too long")
    .optional(),

  address: z
    .string()
    .max(255, "Address must be less than 255 characters")
    .optional(),
});

export const EmployeeUpdateSchema = EmployeeCreateSchema.partial();

export type EmployeeCreateForm = z.infer<typeof EmployeeCreateSchema>;
export type EmployeeUpdateForm = z.infer<typeof EmployeeUpdateSchema>;
