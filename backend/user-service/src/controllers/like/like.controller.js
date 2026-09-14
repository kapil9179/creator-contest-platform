import { likePostService } from "../../services/like/like.service.js";
import apiResponse from "../../utils/apIresponse.js";

const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await likePostService({
      userId: req.user._id,
      postId,
    });

    return apiResponse(
      res,
      200,
      "Post liked successfully",
      post
    );
  } catch (error) {
    next(error);
  }
};

export {
  likePost,
};