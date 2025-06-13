import { Schema, model, Document, Types } from 'mongoose';

export interface ICourseDocument extends Document {
  tenantId: Types.ObjectId;
  name: string;
  description: string;
  category?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
  fee: number;
  isDelete: boolean;
  status: boolean;
}

const CourseSchema: Schema<ICourseDocument> = new Schema<ICourseDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true, index: true },
  description: { type: String },
  category: { type: String },
  level: { type: String },
  duration: { type: String },
  imageUrl: { type: String },
  fee: { type: Number, required: true },
  status: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes
CourseSchema.index({ tenantId: 1, isDelete: 1 });
CourseSchema.index({ tenantId: 1, status: 1 });


export const CourseModel = model<ICourseDocument>('Course', CourseSchema);
