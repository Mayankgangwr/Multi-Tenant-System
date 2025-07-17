import { z } from "zod";

// Regex: Matches + followed by 10 to 14 digits (e.g., +911234567890)
const internationalPhoneRegex = /^\+\d{10,14}$/;

// Optional: You can validate day names in weeklyOff if you want stricter validation
const validWeekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export const createBranchSchema = z.object({
    tenantId: z.string().min(1, "Tenant ID is required."),
    name: z.string().min(1, "Branch name is required."),
    location: z.string().min(1, "Branch location is required."),
    contactEmail: z.string().email("A valid email is required."),
    phoneNumber: z
        .string()
        .regex(internationalPhoneRegex, "Phone number must be valid and include country code."),
    timeZone: z.string().min(1, "Time zone is required."),
    isMainBranch: z.boolean(),
    holidays: z.array(z.string().min(1)).min(1, "At least one holiday is required."),
    weeklyOff: z
        .array(z.enum(validWeekDays as [string, ...string[]]))
        .min(1, "At least one weekly off day is required."),
});

export const updateBranchSchema = createBranchSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update.",
    });
