import { z } from "zod";
import { objectId } from "./IdParam.schema";

export const studentMetaSchema = z
    .object({
        userId: objectId("Invalid student id"), // required
        batchIds: z.array(objectId("Invalid batch id")).optional(),
        enrollmentDate: z.coerce.date().optional(),
        dob: z.coerce.date().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        guardianName: z.string().optional(),
        guardianPhone: z.string().optional(),
        feeStatus: z.enum(["Paid", "Pending", "Partial"]).optional()
    })
    .strict()
    .refine(
        (data) => {
            const { userId, ...rest } = data;
            return (Object.keys(rest) as (keyof typeof rest)[]).some(
                (key) => rest[key] !== undefined
            );
        },
        {
            message: "At least one more property (besides userId) must be provided."
        }
    );
