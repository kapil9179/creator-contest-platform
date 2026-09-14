import Post from "../../models/post/post.model.js";
import createApiError from "../../utils/apierror.js";

// create
const createPostService = async ({
  creator,
  media,
  caption,
  category,
}) => {
  const post = await Post.create({
    creator,
    media,
    caption,
    category,
  });

  if (!post) {
    throw createApiError(
      500,
      "Failed to create post"
    );
  }

  return post;
};

//  get
const getPostsService = async ({
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const [posts, totalPosts] = await Promise.all([
    Post.find()
      .populate("creator", "email residency")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Post.countDocuments(),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
    },
  };
};


export {
  createPostService,
  getPostsService
};