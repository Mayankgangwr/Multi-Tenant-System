import moment from 'moment';
import { Schema, model, Document, Types } from 'mongoose';

export interface IAttendanceDocument extends Document {
  tenantId: Types.ObjectId;
  batchId: Types.ObjectId;
  studentId: Types.ObjectId;
  date: Date;
  status: boolean;
  remarks?: string;
  isDeleted: boolean;
}

const AttendanceSchema = new Schema<IAttendanceDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
      type: Date,
      required: true,
      default: () =>
        moment(moment().format('DD-MM-YYYY'), 'DD-MM-YYYY').toDate(),
    },
    status: { type: Boolean, required: true },
    remarks: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AttendanceSchema.index({ tenantId: 1 });
AttendanceSchema.index({ batchId: 1 });
AttendanceSchema.index({ studentId: 1 });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ isDeleted: 1 });

AttendanceSchema.index(
  { tenantId: 1, batchId: 1, studentId: 1, date: 1 },
  { unique: false, name: 'attendance_lookup' }
);

export const AttendanceModel = model<IAttendanceDocument>('Attendance', AttendanceSchema);
