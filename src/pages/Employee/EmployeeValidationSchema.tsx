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

export const EmployeeCreateSchema = z
  .object({
    memberType: z.enum(["EMPLOYEE", "STUDENT"]),

  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),

  studentClass: z
    .string()
    .max(100, "Class must be less than 100 characters")
    .optional(),

  classTime: z
    .string()
    .max(100, "Class time must be less than 100 characters")
    .optional(),

  classTimeFrom: z
    .string()
    .max(20, "Class time from must be less than 20 characters")
    .optional(),

  classTimeTo: z
    .string()
    .max(20, "Class time to must be less than 20 characters")
    .optional(),

  duration: z
    .string()
    .max(50, "Duration must be less than 50 characters")
    .optional(),

  durationFrom: z
    .string()
    .max(20, "Duration from must be less than 20 characters")
    .optional(),

  durationTo: z
    .string()
    .max(20, "Duration to must be less than 20 characters")
    .optional(),

  classDays: z
    .array(z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]))
    .optional(),

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
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),

    address: z
      .string()
      .max(255, "Address must be less than 255 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.memberType !== "STUDENT") return;

    if (!data.studentClass?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Class is required",
        path: ["studentClass"],
      });
    }

    if (!data.classTimeFrom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Class time from is required",
        path: ["classTimeFrom"],
      });
    }

    if (!data.classTimeTo?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Class time to is required",
        path: ["classTimeTo"],
      });
    }

    if (!data.durationFrom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date is required",
        path: ["durationFrom"],
      });
    }

    if (!data.durationTo?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required",
        path: ["durationTo"],
      });
    }

  });

export const EmployeeUpdateSchema = EmployeeCreateSchema.extend({
  status: z.string().optional(),
});

export type EmployeeCreateForm = z.infer<typeof EmployeeCreateSchema>;
export type EmployeeUpdateForm = z.infer<typeof EmployeeUpdateSchema>;
