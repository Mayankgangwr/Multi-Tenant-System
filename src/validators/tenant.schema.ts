import { z } from "zod";
import mongoose from "mongoose";

// helper to validate the Object format
const objectId = (message: string = "Invalid Id") => z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message
    });

// Create Tenant Schema
export const createTenantSchema = z.object({
    name: z.string().min(3, "Name must be at least 2 characters long."),
    email: z.string().email("Invalid email address."),
    subscriptionId: z.string().optional(),
    status: z.boolean().optional()
});

// Update Tenant Schema
export const updateTenantSchema = z.
    object({
        name: z.string().min(3, "Name must be at least 2 characters long.").optional(),
        email: z.string().email("Invalid email address.").optional(),
        subscriptionId: objectId("Invalid subscription Id.").optional(),
        status: z.boolean().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update.",
    });

export const tenantFilterSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    status: z.enum(["true", "false"]).optional(),
    subscriptionId: objectId("").optional(),
    skip: z.string().regex(/^\d+$/, "Skip must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
})