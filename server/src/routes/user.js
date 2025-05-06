import express from "express";
import {
  registerUser,
  loginUser,
  authenticateUser,
  resendEmailVerification,
  verifyEmailAccount,
  sendForgotPasswordMail,
  resetPassword,
  logout,
  followUser,
  getAUser,
} from "../controller/user.js";
import { verifyToken, authoriseRoles } from "../middleware/auth.js";
import { rateLimiter } from "../middleware/rateLimit.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", rateLimiter, loginUser);
router.post(
  "/resend-verification-email",
  rateLimiter,
  verifyToken,
  authoriseRoles("user", "admin"),
  resendEmailVerification
);
router.post("/sendforgot-password-mail", sendForgotPasswordMail);
router.post(
  "/logout",
  (req, res, next) => {
    clearCache(null, true);
    next();
  },
  logout
);

//getRequst

router.get(
  "/user",
  verifyToken,
  authoriseRoles("user", "admin"),
  cacheMiddleware("auth_User", 600),
  authenticateUser
);

router.patch(
  "/verify-account/:userId/:verificationToken",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("auth_User");
    next();
  },
  verifyEmailAccount
);
router.patch("/reset-password/:userId/:passwordToken", resetPassword);
router.patch(
  "/follow/:id",
  verifyToken,
  authoriseRoles("user", "admin"),
  (req, res, next) => {
    clearCache("auth_User");
    next();
  },
  followUser
);

export default router;
