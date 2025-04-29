import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id required"],
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post id required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

export default Comment;
