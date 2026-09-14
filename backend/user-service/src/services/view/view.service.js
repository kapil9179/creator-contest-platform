import mongoose from "mongoose";
import Post from "../../models/post/post.model.js";
import createApiError from "../../utils/apierror.js";

const incrementPostViewService = async (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw createApiError(
      400,
      "Invalid post id"
    );
  }

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: {
        viewsCount: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!post) {
    throw createApiError(
      404,
      "Post not found"
    );
  }

  return post;
};

export {
  incrementPostViewService,
};