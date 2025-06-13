import { z } from "zod";

export const createPlanSchema = z.object({
    name: z.string().min(3, "Plan name must be at least 3 characters long."),
    price: z.number().min(0, "Price must be a positive number."),
    features: z.array(z.string().min(1, "Feature cannot be empty.")).nonempty("At least one feature is required."),
    duration: z.enum(["Monthly", "Yearly"], { required_error: "Duration is required." }),
    offer: z.record(z.any()).optional(),
    maxUsers: z.number().min(1, "Maximum users must be at least 1."),
    trialPeriodDays: z.number().min(0).optional(),
    isActive: z.boolean().optional()
});

export const updatePlanSchema = createPlanSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update.",
});
