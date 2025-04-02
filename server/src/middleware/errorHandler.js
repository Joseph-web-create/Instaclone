import createHttpError from "http-errors";

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.success = false;
  }
}

export const errorHandler = (err, req, res, next) => {
  if (!err instanceof AppError && !createHttpError.isHttpError(err)) {
    err = createHttpError(
      err.status || 500,
      err.message || "internal Server Error"
    );
  }
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? err instanceof AppError
          ? err.message
          : "An error occured"
        : err.message,
        ...()
  });
};
