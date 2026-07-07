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
  recoveryEmail: z.string().email("Valid recovery email is required"),
  type: z.enum(["Company", "Academic"], {
    message: "Type is required",
  }),
  subType: z.string().optional(),
  logo: z
    .any()
    .optional()
    .refine(
      (file) => !file || file instanceof File || typeof file === "string",
      {
        message: "Logo is required",
      }
    )
    .refine(
      (file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE,
      checkFileSize()
    )
    .refine(
      (file) =>
        !(file instanceof File) ||
        ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
      checkFileType()
    ),
  address: z.string().optional(),
  phone: z.string().optional(),
  totalEmployee: z
    .string()
    .min(1, "Total employees must be at least 1")
    .optional(),
})
  .refine((data) => data.recoveryEmail !== data.email, {
    message: "Recovery email must be different from login email",
    path: ["recoveryEmail"],
  })
  .refine((data) => data.type !== "Company" || !!data.subType?.trim(), {
    message: "Company Type is required when Type is Company",
    path: ["subType"],
  });

export type CompanyCreateForm = z.infer<typeof CompanyCreateSchema>;


export const CompanyEditSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid email is required"),
  recoveryEmail: z
    .string()
    .email("Valid recovery email is required")
    .optional()
    .or(z.literal("")),
  type: z.enum(["Company", "Academic"]).optional(),
  subType: z.string().optional(),
  logo: z
    .any()
    .optional()
    .refine(
      (file) => !file || file instanceof File || typeof file === "string",
      {
        message: "Logo is required",
      }
    )
    .refine(
      (file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE,
      checkFileSize()
    )
    .refine(
      (file) =>
        !(file instanceof File) ||
        ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
      checkFileType()
    ),
  address: z.string().optional(),
  phone: z.string().optional(),
  totalEmployee: z.string().optional(),
  subScribeStatus: z.string().optional(), 
  plan: z.enum(["FREE", "BASIC", "MEDIUM", "ENTERPRISE"]).optional(),
  status: z.string().optional(), 
})
  .refine((data) => !data.recoveryEmail || data.recoveryEmail !== data.email, {
    message: "Recovery email must be different from login email",
    path: ["recoveryEmail"],
  })
  .refine((data) => data.type !== "Company" || !!data.subType?.trim(), {
    message: "Company Type is required when Type is Company",
    path: ["subType"],
  });

export type CompanyUpdateForm = z.infer<typeof CompanyEditSchema>;
