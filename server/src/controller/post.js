import Post from "../model/post.js";
import createHttpError from "http-errors";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

export const createPost = async (req, res, next) => {
  const { caption, description, media, tags, isPublic } = req.body;
  const { id: userId } = req.user;

  if (!caption || media.length === 0) {
    return next(
      createHttpError(400, "Caption, and at least one media file is required")
    );
  }

  //create variables for mediaFiles and mediaResults response

  let mediaFiles;
  let mediaResults;

  try {
    //handle upload to cloudinary
    mediaFiles = async (files) => {
      const results = await Promise.all(
        files.map((file) =>
          uploadToCloudinary(file, {
            folder: "Instashot/posts",
            transformation: [
              { quality: "auto" },
              { fetch_format: "auto" },
              { height: 550 },
            ],
          })
        )
      );
console.log(results)
      return {
        urls: results.map((result) => result.url),
        ids: results.map((result) => result.public_id),
      };
    };
    mediaResults = await mediaFiles(media); // our cloudinary returned response

    //proceed to creating our post

    const post = await Post.create({
      userId: userId,
      caption,
      description,
      tags: tags.split(" "),
      isPublic,
      media: mediaResults.urls,
      mediaPublicIds: mediaResults.ids,
    });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    // delete media upload to cloudinary if post creation failed
    const deleteMedia = async () => {
      if (mediaResults && mediaResults.ids) {
        mediaResults.ids.map((id) => deleteFromCloudinary(id));
      }
    };

    await deleteMedia();

    next(error);
  }
};
