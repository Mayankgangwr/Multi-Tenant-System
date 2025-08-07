import { Document, model, Schema, Types } from "mongoose";


export interface IClassSessionDocument extends Document {
    tenantId: Types.ObjectId;
    batchId: Types.ObjectId;
    title: string;
    teacherId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isLive: boolean;
    streamLink: string;
    isDeleted: boolean;
}
const ClassSessionSchema: Schema<IClassSessionDocument> = new Schema<IClassSessionDocument>({
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    title: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isLive: { type: Boolean, default: false },
    streamLink: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });


ClassSessionSchema.index({ batchId: 1, isDelete: 1 });
ClassSessionSchema.index({ teacherId: 1, isDelete: 1 });


export const ClassSessionModel = model<IClassSessionDocument>('ClassSession', ClassSessionSchema);