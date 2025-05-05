import express from "express";
import {
  createPost,
  getAllPosts,
  handleLikePost,
  seeWhoLikedPost,
  handleSavePost,
  getAPost,
  deletePost,
  updatePost,
} from "../controller/post.js";
import { verifyToken, authoriseRoles } from "../middleware/auth.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //populate user with new data
    next();
  },
  createPost
);

router.get(
  "/get",
  verifyToken,
  authoriseRoles("user", "admin"),
  cacheMiddleware("posts", 600),
  getAllPosts
);

router.patch(
  "/like/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //populate user with new data
    clearCache("post");
    next();
  },
  handleLikePost
);
router.patch(
  "/save/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //populate user with new data
    next();
  },
  handleSavePost
);

router.get(
  "/see-who-liked/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  cacheMiddleware("seeLikes", 600),
  seeWhoLikedPost
);

router.get(
  "/get/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  cacheMiddleware("post", 600),
  getAPost
);

router.delete(
  "/delete/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //populate user with new data
    next();
  },
  deletePost
);

router.patch(
  "/update/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post"); //populate user with new data
    next();
  },
  updatePost
);

export default router;
