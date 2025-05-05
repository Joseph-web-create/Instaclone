import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
  likeComment,
} from "../controller/comment.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";
import { authoriseRoles, verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create/:postId",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments"), clearCache("post");
    next();
  },
  createComment
);

router.get(
  "/get/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  cacheMiddleware("post_Comments", 600),
  getComments
);

router.delete(
  "/delete/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments"), next();
  },
  deleteComment
);

router.patch(
  "/like/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments"), next();
    clearCache("post");
  },
  likeComment
);

export default router;
