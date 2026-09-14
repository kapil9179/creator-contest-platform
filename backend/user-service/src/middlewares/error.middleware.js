
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal server error",
    errors: err.errors || [],
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default globalErrorHandler;