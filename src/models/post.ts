import { model, Schema, type Types } from "mongoose";
import { formatDistance } from "date-fns/fp";

export interface IPost {
  content: string;
  author: Types.ObjectId;
  date: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    date: { type: Date, default: Date.now },
  },
  {
    virtuals: {
      relativeDate: {
        get(): string {
          return `${formatDistance(new Date(), this.date)} ago`;
        },
      },
    },
  },
);

export default model<IPost>("post", postSchema);
