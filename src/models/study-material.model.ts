import { Schema, model, Document, Types } from 'mongoose';

export interface IStudyMaterialDocument extends Document {
  tenantId: Types.ObjectId;
  courseId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  type: 'PDF' | 'Video' | 'Link';
  contentUrl: string;
  uploadedAt: Date;
}

const StudyMaterialSchema: Schema<IStudyMaterialDocument> = new Schema<IStudyMaterialDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  type: { type: String, enum: ['PDF', 'Video', 'Link'], required: true },
  contentUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const StudyMaterialModel = model<IStudyMaterialDocument>('StudyMaterial', StudyMaterialSchema);
