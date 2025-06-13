import { model, Schema, Types } from "mongoose";

export interface IAuditLogDocument extends Document {
    tenantId: Types.ObjectId;
    userId: Types.ObjectId;
    action: string;
    target: string;
    changes: Record<string, any>;
    timestamp: Date;
}

const AuditLogSchema: Schema<IAuditLogDocument> = new Schema<IAuditLogDocument>(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, required: true },
        target: { type: String, required: true },
        changes: { type: Schema.Types.Mixed, default: {} },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: false }
);

export const AuditLogModel = model<IAuditLogDocument>('AuditLog', AuditLogSchema);
