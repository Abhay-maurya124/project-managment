class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // 1. CRITICAL: Check if headers are already sent
  if (res.headersSent) {
    return next(err);
  }

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // 2. Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // 3. Handle Invalid JWT
  if (err.name === "JsonWebTokenError") {
    const message = `JSON web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // 4. Handle MongoDB CastError (Invalid ID)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // 5. Handle Mongoose Validation Errors
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((value) => value.message)
        .join(", ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;