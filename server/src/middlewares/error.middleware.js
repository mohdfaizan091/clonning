import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Operational errors — expected (404, 401, etc.)
  if (err.isOperational) {
    logger.warn(`${statusCode} - ${err.message} - ${req.method} ${req.originalUrl}`);
  } else {
    // Unexpected errors — full stack trace
    logger.error(`${statusCode} - ${err.message}`, {
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
    });
    
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(err);
    }
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;