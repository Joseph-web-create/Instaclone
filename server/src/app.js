import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./routes/user.js";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
app.use(json({ limit: "25mb" }));
// parses request to client side in json body format
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

//api

app.use("/api/auth", userRoutes);

app.use((req, res, next) => {
  return next(createHttpError(404, `Route ${req.originalUrl} not found`));
});

//handle specific app errors
app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "Internal Server Error";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: error.message });
});

export default app;
