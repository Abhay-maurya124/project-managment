class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === "jsonWebTokenError") {
    const message = `JSON web token is invlid,try again`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === "CastError") {
    const message = `Resorce not found Invalid:` + err.path;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((value) => value.message)
        .join(", ")
    : err.message;
  err.statusCode = err.statusCode || 500;
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
