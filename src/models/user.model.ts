import { Schema, model, Document, Types, Query } from 'mongoose';
import { UserRoles } from '../constants';
import ApiError from '../utils/apiError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configENV from '../config/env.config';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  role: UserRoles;
  tenantId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  batchIds?: Types.ObjectId[];
  refreshToken?: string;
  lastLoginAt?: Date;
  isLoggedIn: boolean;
  status: boolean;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  isRefreshTokenValid(): boolean;
}

const UserSchema: Schema<IUserDocument> = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    username: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },

    role: { type: String, enum: Object.values(UserRoles), required: true },

    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: function () {
        return ['BranchManager', 'TenantAdmin'].includes(this.role);
      },
      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: function () {
        return this.role === 'BranchManager';
      },
      index: true,
    },

    batchIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        default: [],
      },
    ],

    refreshToken: { type: String },
    lastLoginAt: { type: Date },
    isLoggedIn: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

// 📄 Useful indexes
UserSchema.index({ tenantId: 1, isDelete: 1 });
UserSchema.index({ tenantId: 1, role: 1, isDelete: 1 });
UserSchema.index({ _id: 1, tenantId: 1, isDelete: 1 });
UserSchema.index({ batchIds: 1, role: 1, isDelete: 1 });

// 🔷 Pre-save hook to hash password
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err: any) {
    next(new ApiError(500, 'Error hashing password'));
  }
});

// 🔷 Pre-findOneAndUpdate hook to hash password if updated
UserSchema.pre<Query<IUserDocument, IUserDocument>>(
  'findOneAndUpdate',
  async function (next) {
    const query = this;
    const update = query.getUpdate() as any;

    if (update?.password) {
      try {
        update.password = await bcrypt.hash(update.password, 10);
        query.setUpdate(update);
      } catch (err: any) {
        return next(new ApiError(500, 'Error hashing password on update'));
      }
    }
    next();
  }
);

// 🔷 Method to compare passwords
UserSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// 🔷 Method to generate an access token
UserSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      id: this._id.toString(),
      email: this.email,
      role: this.role,
    },
    configENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );
};

// 🔷 Method to generate a refresh token
UserSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      id: this._id.toString(),
      role: this.role,
    },
    configENV.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// 🔷 Method to validate refresh token
UserSchema.methods.isRefreshTokenValid = function (): boolean {
  try {
    jwt.verify(this.refreshToken!, configENV.REFRESH_TOKEN_SECRET);
    return true;
  } catch {
    return false;
  }
};

export const UserModel = model<IUserDocument>('User', UserSchema);
