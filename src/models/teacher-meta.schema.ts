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
  isDeleted: boolean;
}

const TeacherMetaSchema: Schema<ITeacherMetaDataDocument> = new Schema<ITeacherMetaDataDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  batchIds: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
  qualification: { type: String, required: true },
  specialization: [{ type: String }],
  experience: { type: String },
  certifications: [{ type: String }],
  joinedAt: { type: Date, required: true },
  isDeleted: { type: Boolean, default: true },
}, { timestamps: true });

TeacherMetaSchema.index({ userId: 1 }, { unique: true });

// Quickly find all teachers for a given batch
TeacherMetaSchema.index({ batchIds: 1 });

// Find teachers who joined at a certain time, or sort by join date:
TeacherMetaSchema.index({ joinedAt: -1 });

// Optional: query by active/deleted status:
TeacherMetaSchema.index({ isDeleted: 1 });

// Optional: if you search for teachers with a particular qualification:
TeacherMetaSchema.index({ qualification: 1 });

// Optional: if you often filter by specialization:
TeacherMetaSchema.index({ specialization: 1 });

// createdAt / updatedAt are already included in timestamps, but adding an index for sorting by newest:
TeacherMetaSchema.index({ createdAt: -1 });


export const TeacherMetaModel = model<ITeacherMetaDataDocument>('TeacherMetaData', TeacherMetaSchema);