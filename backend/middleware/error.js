import { ApiError } from "../utilities/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Check if the error is an instance of ApiError, if not create a new ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Now we're sure we have an ApiError instance
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
