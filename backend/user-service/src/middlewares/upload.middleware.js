import upload from "../configs/upload/upload.config.js";

const uploadPostMedia = upload.single("media");

export {
  uploadPostMedia,
};