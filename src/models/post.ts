import { model, Schema, type Types } from "mongoose";

export interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId;
  date: Date;
  url?: string;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, reference: "user", required: true },
  date: { type: Date, default: Date.now },
});

export default model<IPost>("post", postSchema);
