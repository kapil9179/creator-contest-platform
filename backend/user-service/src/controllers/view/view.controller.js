import { incrementPostViewService } from "../../services/view/view.service.js";
import apiResponse from "../../utils/apIresponse.js";

const incrementPostView = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await incrementPostViewService(
      postId
    );

    return apiResponse(
      res,
      200,
      "Post view recorded successfully",
      post
    );
  } catch (error) {
    next(error);
  }
};

export {
  incrementPostView,
};