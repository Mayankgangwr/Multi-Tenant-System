import { Schema, model, Document, Types } from 'mongoose';

interface ISubject {
  title: string;
  description?: string;
}

export interface ICourseDocument extends Document {
  tenantId: Types.ObjectId;
  name: string;
  description: string;
  category?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
  fee: number;
  subjects?: ISubject[];
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
  subjects: {
    type: [
      {
        _id: 0,
        title: { type: String, required: true },
        description: { type: String },
      }
    ],
    default: [],
  },
  status: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
}, { timestamps: true });

CourseSchema.index({ tenantId: 1, isDelete: 1 });
CourseSchema.index({ tenantId: 1, status: 1 });


export const CourseModel = model<ICourseDocument>('Course', CourseSchema);
