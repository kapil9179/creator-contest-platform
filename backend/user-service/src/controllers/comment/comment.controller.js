import { addCommentService } from "../../services/comment/comment.service.js";
import apiResponse from "../../utils/apIresponse.js";
import createApiError from "../../utils/apierror.js";

const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      throw createApiError(
        400,
        "Comment text is required"
      );
    }

    const comment = await addCommentService({
      userId: req.user._id,
      postId,
      text,
    });

    return apiResponse(
      res,
      201,
      "Comment added successfully",
      comment
    );
  } catch (error) {
    next(error);
  }
};

export {
  addComment,
};