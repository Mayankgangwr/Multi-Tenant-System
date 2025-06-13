import { model, Schema, Types } from "mongoose";

export interface INotificationDocument extends Document {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  type: 'System' | 'Reminder';
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema<INotificationDocument> = new Schema<INotificationDocument>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['System', 'Reminder'], required: true },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const NotificationModel = model<INotificationDocument>('Notification', NotificationSchema);
