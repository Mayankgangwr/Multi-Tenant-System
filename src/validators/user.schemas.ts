import { z } from "zod";
import { UserRoles } from "../constants";
import { isPasswordStrong } from "../utils/isPasswordStrong";

// Basic ObjectId check for ids
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

// Username must be unique & alphanumeric
const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters & underscores");

// Phone is optional but if present must be valid
const phoneSchema = z
  .string()
  .min(7, "Phone must be at least 7 digits")
  .max(15, "Phone must be at most 15 digits")
  .regex(/^[0-9]+$/, "Phone must only contain digits")
  .optional();

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),

    username: usernameSchema,

    email: z.string().email("Invalid email"),

    phone: phoneSchema,

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(isPasswordStrong, {
        message:
          "Password must include at least one lowercase, one uppercase, and one number",
      }),

    profileImage: z.string().url("Profile image must be a valid URL").optional(),

    role: z
      .string()
      .refine(
        (val): val is UserRoles => Object.values(UserRoles).includes(val as UserRoles),
        { message: "Invalid role" }
      ),

    tenantId: objectId.optional(),
    branchId: objectId.optional(),
    batchIds: z.array(objectId).optional(),
  })
  .superRefine((data, ctx) => {
    const { role, tenantId, branchId } = data;

    if (["TenantAdmin", "BranchManager"].includes(role)) {
      if (!tenantId) {
        ctx.addIssue({
          path: ["tenantId"],
          code: z.ZodIssueCode.custom,
          message: "tenantId is required for TenantAdmin and BranchManager",
        });
      }
    }

    if (role === "BranchManager" && !branchId) {
      ctx.addIssue({
        path: ["branchId"],
        code: z.ZodIssueCode.custom,
        message: "branchId is required for BranchManager",
      });
    }

    if (role === "Student" || role === "Teacher") {
      if (!data.batchIds || data.batchIds.length === 0) {
        ctx.addIssue({
          path: ["batchIds"],
          code: z.ZodIssueCode.custom,
          message: "At least one batchId is required for Student and Teacher",
        });
      }
    }
  });

export const updateUserSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),

    username: usernameSchema.optional(),

    email: z.string().email("Invalid email").optional(),

    phone: phoneSchema,

    profileImage: z.string().url("Profile image must be a valid URL").optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(isPasswordStrong, {
        message:
          "Password must include at least one lowercase, one uppercase, and one number",
      })
      .optional(),

    role: z
      .string()
      .refine(
        (val): val is UserRoles => Object.values(UserRoles).includes(val as UserRoles),
        { message: "Invalid role" }
      )
      .optional(),

    tenantId: objectId.optional(),
    branchId: objectId.optional(),
    batchIds: z.array(objectId).optional(),
  })
  .strict({
    message: "One or more unexpected fields were provided.",
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided to update.",
      });
    }

    const { role, tenantId, branchId } = data;

    if (role && ["TenantAdmin", "BranchManager"].includes(role)) {
      if (!tenantId) {
        ctx.addIssue({
          path: ["tenantId"],
          code: z.ZodIssueCode.custom,
          message: "tenantId is required for TenantAdmin and BranchManager",
        });
      }
    }

    if (role === "BranchManager" && !branchId) {
      ctx.addIssue({
        path: ["branchId"],
        code: z.ZodIssueCode.custom,
        message: "branchId is required for BranchManager",
      });
    }
  });


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