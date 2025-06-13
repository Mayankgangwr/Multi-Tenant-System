// subscriptions.schema.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscriptionDocument extends Document {
    planId: Types.ObjectId;
    tenantId: Types.ObjectId;
    startedAt: Date;
    endDate?: Date;
    isExpired: boolean;
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
}

const SubscriptionSchema: Schema<ISubscriptionDocument> = new Schema<ISubscriptionDocument>({
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    startedAt: { type: Date, required: true },
    endDate: { type: Date },
    isExpired: { type: Boolean, default: false },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
});

export const SubscriptionModel = model<ISubscriptionDocument>('Subscription', SubscriptionSchema);
