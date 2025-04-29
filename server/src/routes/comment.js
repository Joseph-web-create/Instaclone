import express from "express";
import { createComment, getComments } from "../controller/comment.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";
import { authoriseRoles, verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create/:postId",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments"), next();
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

export default router;
