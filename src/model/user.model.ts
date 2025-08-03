import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";

// TypeScript interface
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar: {
    url: string;
    public_id: string;
  };
  isEmailVerified: boolean;
  phone: string;
  address: string;
  deletedAt: Date | null;
}

// Mongoose schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    avatar: {
      url: {
        type: String,
        trim: true,
      },
      public_id: {
        type: String,
        trim: true,
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Prevent model overwrite issue in development
const User = mongoose.models.User || model<IUser>("User", userSchema);

export default User;
