import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  isVerified: boolean;
  expiredAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    expiredAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // ⏱️ 10 minutes from now
    },
  },
  { timestamps: true }
);

// TTL Index: auto-delete expired OTPs
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// Avoid model overwrite error in Next.js
const OTP = models.OTP || model<IOTP>('OTP', otpSchema);

export default OTP;
