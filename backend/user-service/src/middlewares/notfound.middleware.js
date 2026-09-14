// src/middleware/notFound.middleware.js

import createApiError from "../utils/apierror.js";

const notFoundHandler = (req, res, next) => {
  next(
    createApiError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`
    )
  );
};

export default notFoundHandler;