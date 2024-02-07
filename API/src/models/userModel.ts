import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  emailVerified: boolean;
  otp: number | null;
  profileImage: string;
  resetRequested: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  emailVerified: { type: Boolean, default: false },
  otp: Number,
  profileImage: String,
  resetRequested: { type: Boolean, default: false },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);
