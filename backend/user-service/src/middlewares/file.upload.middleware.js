import multer from "multer";
import createApiError from "../utils/apierror.js";

const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        createApiError(
          413,
          "Uploaded file is too large"
        )
      );
    }

    return next(
      createApiError(
        400,
        err.message || "File upload failed"
      )
    );
  }

  if (err) {
    return next(
      createApiError(
        400,
        err.message || "Invalid media file"
      )
    );
  }

  next();
};

export default handleFileUploadError;