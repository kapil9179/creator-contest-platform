import express from "express";
import authenticateUser from "../../middlewares/auth.middleware.js";
import { uploadPostMedia } from "../../middlewares/upload.middleware.js";
import handleFileUploadError from "../../middlewares/file.upload.middleware.js";
import { createPost,getPosts } from "../../controllers/post/post.controller.js";
import { likePost } from "../../controllers/like/like.controller.js";
import { addComment } from "../../controllers/comment/comment.controller.js";
import { incrementPostView } from "../../controllers/view/view.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  uploadPostMedia,
  handleFileUploadError,
  createPost
);

router.get(
  "/fetch",
  authenticateUser,
  getPosts
);

router.post(
  "/:postId/like",
  authenticateUser,
  likePost
);

router.post(
  "/:postId/comments",
  authenticateUser,
  addComment
);

router.post(
  "/:postId/view",
  authenticateUser,
  incrementPostView
);

export default router;