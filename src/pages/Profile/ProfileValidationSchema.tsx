import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const checkFileSize = () => ({
  message: `Logo must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
});

const checkFileType = () => ({
  message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
});

export const AdminProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Valid email is required"),
  logo: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File || typeof file === "string", {
      message: "Logo is required",
    })
    .refine((file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE, checkFileSize())
    .refine(
      (file) => !(file instanceof File) || ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
      checkFileType()
    ),
});

export const ClientProfileSchema = AdminProfileSchema.extend({
  recoveryEmail: z
    .string()
    .email("Valid recovery email is required")
    .optional()
    .or(z.literal("")),
  type: z.enum(["Company", "Academic"]).optional(),
  subType: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
}).refine((data) => !data.recoveryEmail || data.recoveryEmail !== data.email, {
  message: "Recovery email must be different from login email",
  path: ["recoveryEmail"],
}).refine((data) => data.type !== "Company" || !!data.subType?.trim(), {
  message: "Company Type is required when Type is Company",
  path: ["subType"],
});

export const UserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  position: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),

  profilePic: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File || typeof file === "string", {
      message: "Profile picture is required",
    })
    .refine((file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE, checkFileSize())
    .refine(
      (file) => !(file instanceof File) || ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
      checkFileType()
    ),
});

export type UserProfileForm = z.infer<typeof UserProfileSchema>;
export type AdminProfileForm = z.infer<typeof AdminProfileSchema>;
export type ClientProfileForm = z.infer<typeof ClientProfileSchema>;
