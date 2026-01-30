import z from "zod";

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

export const UserCreateSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Valid email is required"),
    logo: z
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
})

export type UserCreateForm = z.infer<typeof UserCreateSchema>