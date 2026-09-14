import multer from "multer";
import path from "path";

import { ensureDirectoryExists,generateSafeFileName } from "../../utils/file.utils.js";

const imageUploadPath = path.join(
  process.cwd(),
  "uploads",
  "images"
);

const videoUploadPath = path.join(
  process.cwd(),
  "uploads",
  "videos"
);

ensureDirectoryExists(imageUploadPath);
ensureDirectoryExists(videoUploadPath);

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      return cb(null, imageUploadPath);
    }

    if (allowedVideoTypes.includes(file.mimetype)) {
      return cb(null, videoUploadPath);
    }

    return cb(
      new Error("Unsupported media type"),
      null
    );
  },

  filename: (req, file, cb) => {
    const safeFileName = generateSafeFileName(
      file.originalname
    );

    cb(null, safeFileName);
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = allowedImageTypes.includes(
    file.mimetype
  );

  const isVideo = allowedVideoTypes.includes(
    file.mimetype
  );

  if (!isImage && !isVideo) {
    return cb(
      new Error(
        "Only JPEG, PNG, WEBP, MP4 and WEBM files are allowed"
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export default upload;