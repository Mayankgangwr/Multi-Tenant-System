// tenants.schema.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ITenantDocument extends Document {
    subscriptionId: Types.ObjectId;
    name: string;
    email: string;
    contactPhone?: string;
    address?: string;
    domain?: string;
    logo?: string;
    status: boolean;
    isDelete: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TenantSchema: Schema<ITenantDocument> = new Schema<ITenantDocument>({
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactPhone: { type: String },
    address: { type: String },
    domain: { type: String },
    logo: { type: String },
    status: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });

export const TenantModel = model<ITenantDocument>('Tenant', TenantSchema);
