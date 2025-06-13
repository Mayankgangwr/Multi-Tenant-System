import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscriptionPlanDocument extends Document {
    name: string;
    description: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    maxUsers: number;
    isActive: boolean;
}

const SubscriptionPlanSchema: Schema<ISubscriptionPlanDocument> = new mongoose.Schema<ISubscriptionPlanDocument>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true, default: "monthly" },
        maxUsers: { type: Number, required: true, default: 10 },
        isActive: { type: Boolean, required: true, default: false, }
    },
    {
        timestamps: true
    }
);

const SubscriptionPlan: Model<ISubscriptionPlanDocument> = mongoose.model<ISubscriptionPlanDocument>("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;