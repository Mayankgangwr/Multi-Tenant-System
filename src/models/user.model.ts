import { Schema, model, Document, Types } from 'mongoose';
import { UserRoles } from '../constants';
import ApiError from '../utils/apiError';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import configENV from '../config/configENV';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
  role: UserRoles;
  tenantId?: Types.ObjectId;
  branchId?: Types.ObjectId;
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

const UserSchema: Schema<IUserDocument> = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  password: { type: String, required: true },
  profileImage: { type: String },
  role: { type: String, enum: Object.values(UserRoles), required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
  refreshToken: { type: String },
  lastLoginAt: { type: Date },
  isLoggedIn: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false, index: true },
}, {
  timestamps: true
});

// Compound Indexes (optional but useful for multi-tenant filtering)
UserSchema.index({ tenantId: 1, role: 1 });
UserSchema.index({ tenantId: 1, isDelete: 1 });

// Pre-save hook to hash the password
UserSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err: any) {
    next(new ApiError(500, "Error hashing password"));
  }
});

// Method to compare passwords
UserSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Method to generate an access token
UserSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      role: this.role,
    },
    configENV.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Method to generate a refresh token
UserSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    configENV.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Method to validate refresh token
UserSchema.methods.isRefreshTokenValid = function (): boolean {
  try {
    jwt.verify(this.refreshToken!, configENV.REFRESH_TOKEN_SECRET);
    return true;
  } catch {
    return false;
  }
};


export const UserModel = model<IUserDocument>('User', UserSchema);
