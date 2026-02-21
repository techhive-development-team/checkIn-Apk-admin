import { z } from "zod";

const MAX_IMAGE_SIZE = 1024 * 1024 * 2;

const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageSchema = z
  .any()
  .optional()
  .refine((file) => !file || file instanceof File || typeof file === "string", {
    message: "Invalid image file",
  })
  .refine(
    (file) => !(file instanceof File) || file.size <= MAX_IMAGE_SIZE,
    {
      message: `Image must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
    }
  )
  .refine(
    (file) =>
      !(file instanceof File) ||
      ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
    {
      message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
    }
  );

export const LeaveRequestCreateSchema = z
  .object({
    leaveType: z.enum(["ANNUAL", "SICK", "EMERGENCY", "UNPAID", "PATERNITY"]),

    startDate: z
      .string()
      .nonempty("Start date is required")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Start date must be a valid date",
      }),

    endDate: z
      .string()
      .nonempty("End date is required")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "End date must be a valid date",
      }),

    reason: z.string().min(1, "Reason is required"),

    file: imageSchema,
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export type LeaveRequestCreateForm = z.infer<typeof LeaveRequestCreateSchema>;