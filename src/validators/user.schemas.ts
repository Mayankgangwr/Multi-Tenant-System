import { z } from "zod";
import { isPasswordStrong } from "../utils/isPasswordStrong";
import { UserRoles, Role } from "../constants";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters!"),
    
    username: z
      .string()
      .min(4, "Username must be at least 4 characters long!")
      .max(30, "Username must be at most 30 characters!")
      .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric with no spaces or special characters!"),

    email: z.string().email("Invalid email format!"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters!")
      .regex(/[a-z]/, "Password must contain a lowercase letter!")
      .regex(/[A-Z]/, "Password must contain an uppercase letter!")
      .regex(/[0-9]/, "Password must contain a number!"),

    role: z
      .string()
      .refine(
        (val): val is keyof typeof UserRoles =>
          Object.values(UserRoles).includes(val as UserRoles),
        { message: "Invalid role provided!" }
      ),

    tenantId: z.string().optional(),
    branchId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { role, tenantId, branchId } = data;

    if (role !== UserRoles.SuperAdmin) {
      if (!tenantId) {
        ctx.addIssue({
          path: ["tenantId"],
          code: z.ZodIssueCode.custom,
          message: "tenantId is required for selected roles.",
        });
      }

      if (![UserRoles.SuperAdmin, UserRoles.TenantAdmin].includes(role as UserRoles) && !branchId) {
        ctx.addIssue({
          path: ["branchId"],
          code: z.ZodIssueCode.custom,
          message: "branchId is required for selected roles.",
        });
      }
    }
  });


export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters!.").optional(),
  email: z.string().email("Invalid email format!.").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters!.")
    .regex(/[a-z]/, "Password must contain a lowercase letter!.")
    .regex(/[A-Z]/, "Password must contain an uppercase letter!.")
    .regex(/[0-9]/, "Password must contain a number!.").optional(),
  role: z
    .string()
    .refine((val): val is Role => Object.values(UserRoles).includes(val as Role), {
      message: "Invalid role provided!",
    }).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided to update.",
})

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required."),
    newPassword: z.string().refine(isPasswordStrong, {
      message:
        "Password must be at least 8 characters long, include uppercase, lowercase, and a digit.",
    }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "New password and confirmation do not match.",
  });