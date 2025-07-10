import { Schema, model, Types, Document } from 'mongoose';

export interface IEnrollmentDocument extends Document {
    studentId: Types.ObjectId;
    batchId: Types.ObjectId;
    enrolledAt: Date;
    fee: {
        amount: number;
        currency: string;
        paid: number;
        due: number;
        status: 'unpaid' | 'partial' | 'paid';
    };
    status: 'active' | 'completed' | 'cancelled';
}

const EnrollmentSchema: Schema<IEnrollmentDocument> = new Schema<IEnrollmentDocument>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
        enrolledAt: { type: Date, default: Date.now },
        fee: {
            amount: { type: Number, required: true },
            currency: { type: String, default: 'INR' },
            paid: { type: Number, default: 0 },
            due: { type: Number, required: true },
            status: {
                type: String,
                enum: ['unpaid', 'partial', 'paid'],
                default: 'unpaid',
            },
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true }
);

export const EnrollmentModel = model<IEnrollmentDocument>('Enrollment', EnrollmentSchema);
