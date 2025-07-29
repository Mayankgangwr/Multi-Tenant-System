import { Schema, model, Document, Types } from 'mongoose';

export type ICurrency = 'INR' | 'USD'; // extend as needed
export type IPaymentStatus = 'PENDING' | 'FAILED' | 'SUCCESS' | "USER_DROPPED";
export type IPaymentMethod = 'UPI' | 'NetBanking' | 'Card';
export type IPaymentGateway = 'CASHFREE';

export interface IPaymentDocument extends Document {
  tenantId: Types.ObjectId;
  studentId: Types.ObjectId;
  batchId: Types.ObjectId;
  order_id: string;
  amount: number;
  currency: ICurrency;
  status: IPaymentStatus;
  bank_reference: string;
  payment_message: string;
  payment_time: Date;
  paymentMethod: IPaymentMethod;
  paymentGateway: IPaymentGateway;
}

const PaymentSchema: Schema<IPaymentDocument> = new Schema<IPaymentDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    order_id: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['INR', 'USD'], required: true, default: "INR" },
    status: { type: String, enum: ['PENDING', 'FAILED', 'SUCCESS', "USER_DROPPED"], required: true, default: "PENDING" },
    bank_reference: { type: String },
    payment_message: { type: String },
    payment_time: { type: Date },
    paymentMethod: { type: String, enum: ['UPI', 'NetBanking', 'Card'] },
    paymentGateway: { type: String, enum: ['CASHFREE'], default: 'CASHFREE' },
  },
  { timestamps: true }
);

export const PaymentModel = model<IPaymentDocument>('Payment', PaymentSchema);
