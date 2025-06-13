import { model, Schema, Types } from "mongoose";

export interface ISupportTicketDocument extends Document {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  subject: string;
  message: string;
  status: 'Open' | 'Closed';
  createdAt: Date;
}

const SupportTicketSchema: Schema<ISupportTicketDocument> = new Schema<ISupportTicketDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Closed'], required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const SupportTicketModel = model<ISupportTicketDocument>('SupportTicket', SupportTicketSchema);
