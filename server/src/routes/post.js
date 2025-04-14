import express from "express";
import { createPost, getAllPosts } from "../controller/post.js";
import { verifyToken, authoriseRoles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authoriseRoles("user", "admin"),
  createPost
);

export default router;
