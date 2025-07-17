import z from "zod";
import { objectId } from "./IdParam.schema";

export const createAttendanceSchema = z.object({
    tenantId: objectId("Tenant ID is required"),
    batchId: objectId("Batch ID is required"),
    studentId: objectId("Student ID is required"),
    status: z.boolean({ required_error: "Status is required" }),
    remarks: z.string().max(500).optional(), // optional, limit length
});

export const updateAttendanceSchema = z
    .object({
        tenantId: objectId("Tenant ID is required"),
        status: z.boolean({ required_error: "Status is required" }),
        remarks: z.string().max(500).optional(),
    })
    .strict();
