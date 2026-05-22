import { z } from "zod";

/**
 * Assignment validation schemas
 */
export const assignmentCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  description: z
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .nullable()
    .optional(),
  dueDate: z.string().datetime("Due date must be a valid ISO 8601 date"),
  subject: z.string().min(1, "Subject is required").max(100),
  assignedToId: z.string().min(1, "Student ID is required"),
  attachmentUrl: z
    .string()
    .url("Attachment must be a valid URL")
    .nullable()
    .optional(),
});

export const assignmentUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  dueDate: z.string().datetime().optional(),
  subject: z.string().min(1).max(100).optional(),
  status: z.enum(["ASSIGNED", "IN_PROGRESS", "SUBMITTED", "GRADED"]).optional(),
  attachmentUrl: z.string().url().nullable().optional(),
});

/**
 * Message validation schemas
 */
export const messageCreateSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message must be 5000 characters or less"),
  receiverId: z.string().min(1, "Recipient ID is required"),
  threadId: z.string().optional(),
});

export const messageMarkReadSchema = z.object({
  isRead: z.boolean(),
});

/**
 * Profile validation schemas
 */
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255).optional(),
  email: z.string().email("Invalid email address").optional(),
  gradeLevel: z
    .number()
    .int()
    .min(1, "Grade must be 1 or higher")
    .max(12, "Grade must be 12 or lower")
    .optional(),
  subjects: z
    .array(z.string().min(1))
    .max(10, "Maximum 10 subjects allowed")
    .optional(),
  image: z.string().url("Avatar must be a valid URL").nullable().optional(),
});

export const studentProfileUpdateSchema = profileUpdateSchema.extend({
  guardianId: z.string().optional(),
});

export const guardianProfileUpdateSchema = profileUpdateSchema.extend({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
});

/**
 * File upload validation schema
 */
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File must be 10MB or less",
    )
    .refine((file) => {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      return validTypes.includes(file.type);
    }, "File type not supported. Allowed: PDF, images (JPEG/PNG), text, Word, Excel"),
});

/**
 * Admin user creation/update schemas
 */
export const userCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(255),
  role: z.enum(["STUDENT", "TUTOR", "GUARDIAN", "ADMIN"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
  gradeLevel: z.number().int().min(1).max(12).optional(),
  subjects: z.array(z.string()).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  image: z.string().url().nullable().optional(),
  gradeLevel: z.number().int().min(1).max(12).optional(),
  subjects: z.array(z.string()).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
});

/**
 * Session validation schemas
 */
export const sessionCreateSchema = z.object({
  title: z.string().min(1, "Session title is required").max(255),
  description: z.string().max(5000).optional(),
  startTime: z.string().datetime("Start time must be a valid ISO 8601 date"),
  endTime: z.string().datetime("End time must be a valid ISO 8601 date"),
  studentId: z.string().min(1, "Student ID is required"),
  type: z.enum(["ONLINE", "IN_PERSON"]).optional(),
});

export const sessionUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  status: z
    .enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  type: z.enum(["ONLINE", "IN_PERSON"]).optional(),
});

/**
 * Payment validation schemas
 */
export const paymentCreateSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string().length(3, "Currency must be a 3-letter code"),
  description: z.string().optional(),
  studentId: z.string().min(1, "Student ID is required"),
  stripePaymentIntentId: z.string().optional(),
});

/**
 * Title unlock validation schema
 */
export const titleUnlockSchema = z.object({
  titleId: z.string().min(1, "Title ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  skip: z.number().int().min(0).default(0),
  take: z.number().int().min(1).max(100).default(20),
});

/**
 * Sorting schema
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
