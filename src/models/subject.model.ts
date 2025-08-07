import { Schema, model, Document, Types } from 'mongoose';

export interface ISubjectDocument extends Document {
    tenantId: Types.ObjectId;
    title: string;
    description?: string;
    isDelete: boolean;
    status: boolean;
}

const SubjectSchema: Schema<ISubjectDocument> = new Schema<ISubjectDocument>({
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    title: { type: String, required: true, index: true },
    description: { type: String },
    status: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });

SubjectSchema.index({ tenantId: 1, isDelete: 1 });
SubjectSchema.index({ tenantId: 1, status: 1 });


export const SubjectModel = model<ISubjectDocument>('Subject', SubjectSchema);
