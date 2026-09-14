import path from "path";
import { createPostService } from "../../services/post/post.service.js";
import { getPostsService } from "../../services/post/post.service.js";
import apiResponse from "../../utils/apIresponse.js";
import createApiError from "../../utils/apierror.js";
import { deleteFile } from "../../utils/file.utils.js";


//  create post 
const createPost = async (req, res, next) => {
  try {
    const { caption, category } = req.body;

    if (!caption || !caption.trim()) {
      throw createApiError(
        400,
        "Caption is required"
      );
    }

    if (!category || !category.trim()) {
      throw createApiError(
        400,
        "Category is required"
      );
    }

    if (!req.file) {
      throw createApiError(
        400,
        "Media file is required"
      );
    }

    const relativeMediaPath = path
      .relative(process.cwd(), req.file.path)
      .replace(/\\/g, "/");

    const post = await createPostService({
      creator: req.user._id,
      media: relativeMediaPath,
      caption: caption.trim(),
      category: category.trim().toLowerCase(),
    });

    return apiResponse(
      res,
      201,
      "Post created successfully",
      post
    );
  } catch (error) {
    if (req.file?.path) {
      deleteFile(req.file.path);
    }

    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      throw createApiError(
        400,
        "Page and limit must be greater than 0"
      );
    }

    const result = await getPostsService({
      page,
      limit,
    });

    return apiResponse(
      res,
      200,
      "Posts fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


export {
  createPost,
  getPosts
};