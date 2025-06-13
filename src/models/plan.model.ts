// plans.schema.ts
import { Schema, model, Document } from 'mongoose';

export interface IPlanDocument extends Document {
  name: string;
  price: number;
  features: string[];
  duration: 'Monthly' | 'Yearly';
  offer: Record<string, any>;
  maxUsers: number;
  trialPeriodDays?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema: Schema<IPlanDocument> = new Schema<IPlanDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String, required: true }],
  duration: { type: String, enum: ['Monthly', 'Yearly'], required: true },
  offer: { type: Schema.Types.Mixed, default: {} },
  maxUsers: { type: Number, default: 0 },
  trialPeriodDays: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const PlanModel = model<IPlanDocument>('Plan', PlanSchema);


