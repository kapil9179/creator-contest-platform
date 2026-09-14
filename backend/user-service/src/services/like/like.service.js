import mongoose from "mongoose";
import Like from "../../models/like/like.model.js";
import Post from "../../models/post/post.model.js";
import createApiError from "../../utils/apierror.js";

const likePostService = async ({
  userId,
  postId,
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

  try {
    await Like.create({
      user: userId,
      post: postId,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createApiError(
        409,
        "Post already liked"
      );
    }

    throw error;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: {
        likesCount: 1,
      },
    },
    {
      new: true,
    }
  );

  return updatedPost;
};

export {
  likePostService,
};