import { z } from "zod";

export const createSubscriptionSchema = z.object({
  planId: z.string().min(1),
  tenantId: z.string().min(1),
  startedAt: z.string().or(z.date()),
  endDate: z.string().optional().or(z.date().optional()),
  isExpired: z.boolean().optional(),
  paymentStatus: z.enum(["Pending", "Paid", "Failed"]),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();
