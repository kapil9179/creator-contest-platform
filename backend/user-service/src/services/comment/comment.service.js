import mongoose from "mongoose";
import Comment from "../../models/comment/comment.model.js";
import Post from "../../models/post/post.model.js";
import createApiError from "../../utils/apierror.js";

const addCommentService = async ({
  userId,
  postId,
  text,
}) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw createApiError(
      400,
      "Invalid post id"
    );
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw createApiError(
      404,
      "Post not found"
    );
  }

  const comment = await Comment.create({
    user: userId,
    post: postId,
    text: text.trim(),
  });

  await Post.findByIdAndUpdate(
    postId,
    {
      $inc: {
        commentsCount: 1,
      },
    }
  );

  return comment;
};

export {
  addCommentService,
};