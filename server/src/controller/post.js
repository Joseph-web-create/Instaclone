import Post from "../model/post.js";
import createHttpError from "http-errors";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import User from "../model/user.js";
import Comment from "../model/comment.js";

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
      tags,
      isPublic,
      media: mediaResults.urls,
      mediaPublicIds: mediaResults.ids,
    });

    const populatePost = await Post.findById(post._id).populate(
      "userId",
      "username profilePicture"
    );
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatePost,
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

export const getAllPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / limit);

  try {
    const posts = await Post.find()
      .populate("userId", "username profilePicture")
      .populate("likes", "username profilePicture")
      .populate("savedBy", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasmore: skip + posts.length < totalPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleLikePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;

  try {
    if (!postId) {
      return next(createHttpError(400, "Post params is required"));
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    //check if likes field in post to see if the userId is in there

    if (post.likes.map((id) => id.toString()).includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    //populate useruserId in likes array with extra data before sending response

    const populatePost = await Post.findById(post._id)
      .populate("userId", "username profilePicture")
      .populate("likes", "username profilePicture");
    res.status(200).json({
      success: true,
      message: populatePost.likes.some((id) => id._id.toString() === userId)
        ? "Post liked"
        : "Post unLikes",
      post: populatePost,
    });
  } catch (error) {
    next(error);
  }
};

export const seeWhoLikedPost = async (req, res, next) => {
  const { id: postId } = req.params;

  try {
    if (!postId) {
      return next(createHttpError(400, "Post params is required"));
    }
    const post = await Post.findById(postId).sort({ createdAt: -1 });
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    //find each user in likes array of post

    const getUser = post.likes.map((id) =>
      User.findById(id).select(
        "id username profilePicture fullname followers following"
      )
    );
    const users = await Promise.all(getUser);
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const handleSavePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;

  try {
    if (!postId) {
      return next(createHttpError(400, "Post params is required"));
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    //check if likes field in post to see if the userId is in there

    if (post.savedBy.map((id) => id.toString()).includes(userId)) {
      post.savedBy = post.savedBy.filter((id) => id.toString() !== userId);
    } else {
      post.savedBy.push(userId);
    }
    await post.save();
    //populate useruserId in likes array with extra data before sending response

    const populatePost = await Post.findById(post._id)
      .populate("userId", "username profilePicture")
      .populate("savedBy", "username profilePicture");
    res.status(200).json({
      success: true,
      message: populatePost.savedBy.some((id) => id._id.toString() === userId)
        ? "Post saved"
        : "Post unsaved",
      post: populatePost,
    });
  } catch (error) {
    next(error);
  }
};

export const getAPost = async (req, res, next) => {
  const { id: postId } = req.params;
  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }
    const [post, comments] = await Promise.all([
      Post.findById(postId)
        .populate("userId", "username profilePicture")
        .populate("likes", "username profilePicture")
        .populate("savedBy", "username profilePicture"),
      await Comment.find({ postId })
        .populate("user", "username profilePicture")
        .sort({ createdAt: -1 }),
    ]);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }

    res.status(200).json({
      success: true,
      post,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;

  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }

    if (post.userId.toString() !== userId) {
      return next(
        createHttpError(401, "unauthorized, you cannot delete this post")
      );
    }

    for (const publicIds of post.mediaPublicIds) {
      await deleteFromCloudinary(publicIds);
    }

    const deletePromises = [];
    deletePromises.push(Post.findByIdAndDelete(postId)),
      Comment.deleteMany({ postId: postId });

    await Promise.all(deletePromises);
    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const { caption, description, tags } = req.body;

  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    if (post.userId.toString() !== userId) {
      return next(createHttpError(401, "Unauthorized to perform this request"));
    }

    const updateDate = {
      caption: caption || post.caption,
      description: description || post.description,
      tags: tags || post.tags,
    };

    const updatePost = await Post.findByIdAndUpdate(post, updateDate, {
      new: true,
    }).populate("userId", "username profilePicture");

    res.status(200).json({
      success: true,
      message: "Post updated",
      post: updatePost,
    });
  } catch (error) {
    next(error);
  }
};
