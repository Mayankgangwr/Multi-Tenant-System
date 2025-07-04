import { z } from "zod";
import { objectId } from "./IdParam.schema";

export const teacherMetaSchema = z
    .object({
        userId: objectId('Invalid teacher id'), // required
        batchIds: z.array(objectId('Invalid batch id')).optional(),
        qualification: z.string().optional(),
        specialization: z.array(z.string()).optional(),
        experience: z.string().optional(),
        certifications: z.array(z.string()).optional(),
        joinedAt: z.coerce.date().optional(),
        isDeleted: z.boolean().optional()
    })
    .strict()
    .refine(
        (data) => {
            const { userId, ...rest } = data;
            return (Object.keys(rest) as (keyof typeof rest)[])
                .some((key) => rest[key] !== undefined);
        },
        {
            message: "At least one more property (besides userId) must be provided."
        }
    );
