// branches.schema.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IBranchDocument extends Document {
  tenantId: Types.ObjectId;
  name: string;
  location: string;
  contactEmail?: string;
  phoneNumber?: string;
  timeZone: string;
  isMainBranch: boolean;
  holidays: string[];
  weeklyOff: string[];
}

const BranchSchema: Schema<IBranchDocument> = new Schema<IBranchDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  contactEmail: { type: String },
  phoneNumber: { type: String },
  timeZone: { type: String, required: true },
  isMainBranch: { type: Boolean, default: false },
  holidays: [{ type: String, default: [] }],
  weeklyOff: [{ type: String, default: [] }],
}, { timestamps: true });

export const BranchModel = model<IBranchDocument>('Branch', BranchSchema);
