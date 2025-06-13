import { model, Schema, Types } from "mongoose";

export interface ISessionLogDocument extends Document {
  userId: Types.ObjectId;
  ip: string;
  device: string;
  loggedInAt: Date;
  loggedOutAt?: Date;
}

const SessionLogSchema: Schema<ISessionLogDocument> = new Schema<ISessionLogDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ip: { type: String, required: true },
  device: { type: String, required: true },
  loggedInAt: { type: Date, required: true },
  loggedOutAt: { type: Date },
}, { timestamps: false });

export const SessionLogModel = model<ISessionLogDocument>('SessionLog', SessionLogSchema);
