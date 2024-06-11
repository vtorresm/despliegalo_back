import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userEmail: string;
  userPassword: string;
  userName: string;
  confirmed: boolean;
}

const UserSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
