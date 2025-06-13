// payments.schema.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IPaymentDocument extends Document {
  tenantId: Types.ObjectId;
  studentId: Types.ObjectId;
  amount: number;
  date: Date;
  status: 'Pending' | 'Failed' | 'Done';
  method: 'Cash' | 'UPI' | 'NetBanking';
  invoiceId?: string;
  transactionId?: string;
  paymentGateway?: string;
}

const PaymentSchema: Schema<IPaymentDocument> = new Schema<IPaymentDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Failed', 'Done'], required: true },
  method: { type: String, enum: ['Cash', 'UPI', 'NetBanking'], required: true },
  invoiceId: { type: String },
  transactionId: { type: String },
  paymentGateway: { type: String },
}, { timestamps: true });

export const PaymentModel = model<IPaymentDocument>('Payment', PaymentSchema);

