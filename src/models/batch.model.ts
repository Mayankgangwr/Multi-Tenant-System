// batches.schema.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IBatchDocument extends Document {
  tenantId: Types.ObjectId;
  courseId: Types.ObjectId;
  branchId: Types.ObjectId;
  teacherId: Types.ObjectId;
  schedule: Date;
  maxCapacity?: number;
  isFull?: boolean;
  status?: boolean;
}

const BatchSchema: Schema<IBatchDocument> = new Schema<IBatchDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: { type: Date, required: true },
  maxCapacity: { type: Number, default: 0 },
  isFull: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
}, { timestamps: true });

export const BatchModel = model<IBatchDocument>('Batch', BatchSchema);

