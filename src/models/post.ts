import { model, Schema, type Types } from "mongoose";
import { formatDistanceToNow } from "date-fns";

export interface IPost {
    content: string;
    author: Types.ObjectId;
    date: Date;
}

const postSchema = new Schema<IPost>({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    date: { type: Date, default: Date.now },
});

postSchema.methods.getRelativeDate = function (): string {
    return formatDistanceToNow(this.date, { addSuffix: true });
};

export default model<IPost>("post", postSchema);
