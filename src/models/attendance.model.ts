import { Schema, model, Document, Types } from 'mongoose';

export interface IAttendanceDocument extends Document {
  tenantId: Types.ObjectId;
  batchId: Types.ObjectId;
  studentId: Types.ObjectId;
  date: Date;
  status: boolean;
  remarks?: string;
}

const AttendanceSchema: Schema<IAttendanceDocument> = new Schema<IAttendanceDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: Boolean, required: true },
  remarks: { type: String },
}, { timestamps: true });

export const AttendanceModel = model<IAttendanceDocument>('Attendance', AttendanceSchema);

