import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 5 minu
  max: 10, //10 attempts within a 5 min window
  message: "Too many request attempts, Please try again later",
});
