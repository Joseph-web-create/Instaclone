import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      requred: [true, "User id is required"],
    },
    title: {
      type: String,
      trim: true,
      requred: [true, "Title is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    media: {
      type: [String],
      required: [true, "Media files are required"],
    },
    mediaPublicIds: {
      type: [String],
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    savedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const post = model("Post", postSchema);

export default post;
