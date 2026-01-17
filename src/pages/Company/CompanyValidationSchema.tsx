import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 2; 
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const checkFileSize = () => ({
  message: `Logo must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
});

const checkFileType = () => ({
  message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
});

export const CompanyCreateSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid email is required"),
  logo: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File || typeof file === "string", {
      message: "Logo is required",
    })
    .refine((file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE, checkFileSize())
    .refine(
      (file) =>
        !(file instanceof File) || ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
      checkFileType()
    ),
  companyType: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  totalEmployee: z.string().optional(),
});

export type CompanyCreateForm = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdateForm = z.infer<typeof CompanyCreateSchema>;
