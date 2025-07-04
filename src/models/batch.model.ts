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
  isDeleted: boolean;
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
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

BatchSchema.index({ tenantId: 1 });
BatchSchema.index({ courseId: 1 });
BatchSchema.index({ branchId: 1 });
BatchSchema.index({ teacherId: 1 });
BatchSchema.index({ createdAt: -1 });

export const BatchModel = model<IBatchDocument>('Batch', BatchSchema);

