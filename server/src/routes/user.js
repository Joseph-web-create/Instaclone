import express from "express";
import {
  registerUser,
  loginUser,
  authenticateUser,
  resendEmailVerification,
  verifyEmailAccount,
} from "../controller/user.js";

import { verifyToken, authoriseRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post(
  "/resend-verification-email",
  verifyToken,
  authoriseRoles("user", "admin"),
  resendEmailVerification
);

//getRewust

router.get(
  "/user",
  verifyToken,
  authoriseRoles("user", "admin"),
  authenticateUser
);

router.patch(
  "/verify-account/:userId/:verificationToken",
  verifyToken,
  authoriseRoles("user", "admin"),
  verifyEmailAccount
);

export default router;
