import express from "express";
import { createPost, getAllPosts } from "../controller/post.js";
import { verifyToken, authoriseRoles } from "../middleware/auth.js";
import { cacheMiddleware } from "../middleware/cache.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authoriseRoles("user", "admin"),
  createPost
);

router.get(
  "/get",
  verifyToken,
  authoriseRoles("user", "admin"),
  cacheMiddleware("posts", 600),
  getAllPosts
);

export default router;
