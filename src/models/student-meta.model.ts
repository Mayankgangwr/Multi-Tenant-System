import { Schema, model, Document, Types } from 'mongoose';

export interface IStudentMetaDataDocument extends Document {
    userId: Types.ObjectId;
    batchIds: Types.ObjectId[];
    enrollmentDate: Date;
    dob?: Date;
    address?: string;
    phone?: string;
    guardianName?: string;
    guardianPhone?: string;
    feeStatus: 'Paid' | 'Pending' | 'Partial';
}

const StudentMetaSchema: Schema<IStudentMetaDataDocument> = new Schema<IStudentMetaDataDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    batchIds: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
    enrollmentDate: { type: Date, required: true },
    dob: { type: Date },
    address: { type: String },
    phone: { type: String },
    guardianName: { type: String },
    guardianPhone: { type: String },
    feeStatus: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
}, { timestamps: true });

export const StudentMetaModel = model<IStudentMetaDataDocument>('StudentMetaData', StudentMetaSchema);

