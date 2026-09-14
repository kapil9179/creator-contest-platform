import { calculatePostScore } from "../../utils/ranking/score.utils.js";
import { compareRankedPosts } from "../../utils/ranking/compare.ranking.js";


const getGlobalRanking = (posts) => {
  const bestPostByCreator = new Map();

  for (const post of posts) {
    if (
      !post.creator ||
      post.creator.residency !== "Chhattisgarh"
    ) {
      continue;
    }

    const scoredPost = {
      ...post,
      score: calculatePostScore(post),
    };

    const creatorId = String(post.creator._id);

    const existingPost =
      bestPostByCreator.get(creatorId);

    if (!existingPost) {
      bestPostByCreator.set(
        creatorId,
        scoredPost
      );

      continue;
    }

    const comparison = compareRankedPosts(
      scoredPost,
      existingPost
    );

    if (comparison < 0) {
      bestPostByCreator.set(
        creatorId,
        scoredPost
      );
    }
  }

  return Array.from(
    bestPostByCreator.values()
  ).sort(compareRankedPosts);
};

export {
  getGlobalRanking,
};