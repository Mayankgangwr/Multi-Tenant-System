import { z } from "zod";

export const createCourseSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required."),
  name: z.string().min(1, "Course name is required."),
  description: z.string().min(1, "Course description is required."),
  category: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL format.").optional(),
  fee: z.number().nonnegative("Fee must be a non-negative number."),
});

export const updateCourseSchema = createCourseSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update.",
});