import { z } from "zod";

const MAX_IMAGE_SIZE = 1024 * 1024 * 2;

const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const checkImageSize = () => ({
  message: `Image must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
});

const checkImageType = () => ({
  message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
});

const imageSchema = z
  .any()
  .optional()
  .refine((file) => !file || file instanceof File || typeof file === "string", {
    message: "Invalid image file",
  })
  .refine(
    (file) => !(file instanceof File) || file.size <= MAX_IMAGE_SIZE,
    checkImageSize(),
  )
  .refine(
    (file) =>
      !(file instanceof File) || ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
    checkImageType(),
  );

export const AttendanceUpdateSchema = z.object({
  checkInTime: z.date().optional(),

  checkInLocation: z.string().optional(),

  checkInPhoto: imageSchema,

  checkOutTime: z.date().optional(),

  checkOutLocation: z.string().optional(),

  checkOutPhoto: imageSchema,
  
});
export type AttendanceUpdateForm = z.infer<typeof AttendanceUpdateSchema>;
