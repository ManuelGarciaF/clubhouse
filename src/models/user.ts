import { model, Schema } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  isMember: boolean;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isMember: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false },
});

export default model<IUser>("user", userSchema);
