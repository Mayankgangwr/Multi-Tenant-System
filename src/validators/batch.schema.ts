import z from "zod";
import { objectId } from "./IdParam.schema";

export const createBatchSchema = z.object({
    tenantId: objectId("Tenant ID is required"),
    courseId: objectId("Course ID is required"),
    branchId: objectId("Branch ID is required"),
    teacherId: objectId("Teacher ID is required"),
    schedule: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid schedule date",
        }),
    maxCapacity: z.number().int().positive().optional(),
    isFull: z.boolean().optional(),
    status: z.boolean().optional(),
});

export const updateBatchSchema = createBatchSchema
    .partial()
    .extend({
        tenantId: objectId("Tenant ID is required"), // force required again
    })
    .strict()
    .refine(
        (data) => {
            const { tenantId, ...rest } = data;
            return Object.keys(rest).length > 0;
        },
        {
            message: "At least one field (other than tenantId) must be provided.",
        }
    );
