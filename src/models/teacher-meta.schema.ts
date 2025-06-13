// teacher-meta.schema.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ITeacherMetaDataDocument extends Document {
  userId: Types.ObjectId;
  batchIds: Types.ObjectId[];
  qualification: string;
  specialization: string[];
  experience?: string;
  certifications?: string[];
  joinedAt: Date;
}

const TeacherMetaSchema: Schema<ITeacherMetaDataDocument> = new Schema<ITeacherMetaDataDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  batchIds: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
  qualification: { type: String, required: true },
  specialization: [{ type: String }],
  experience: { type: String },
  certifications: [{ type: String }],
  joinedAt: { type: Date, required: true },
}, { timestamps: true });

export const TeacherMetaModel = model<ITeacherMetaDataDocument>('TeacherMetaData', TeacherMetaSchema);