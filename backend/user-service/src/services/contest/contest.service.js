import Post from "../../models/post/post.model.js";

const getContestDataService = async () => {
  const posts = await Post.find()
    .populate("creator", "email residency")
    .select(
      "creator category likesCount commentsCount viewsCount createdAt"
    )
    .lean();

  return posts;
};

export {
  getContestDataService,
};



