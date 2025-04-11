import express from "express";
import { createPost } from "../controller/post.js";
import { verifyToken, authoriseRoles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authoriseRoles("user", "admin"),
  createPost
);

export default router;
