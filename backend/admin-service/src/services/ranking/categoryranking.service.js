import { calculatePostScore } from "../../utils/ranking/score.utils.js";
import { compareRankedPosts } from "../../utils/ranking/compare.ranking.js";

const getCategoryRanking = (posts) => {
  const categoryMap = new Map();

  for (const post of posts) {
    if (
      !post.creator ||
      post.creator.residency !== "Chhattisgarh"
    ) {
      continue;
    }

    const category = post.category;
    const creatorId = String(post.creator._id);

    const scoredPost = {
      ...post,
      score: calculatePostScore(post),
    };

    if (!categoryMap.has(category)) {
      categoryMap.set(
        category,
        new Map()
      );
    }

    const creatorMap =
      categoryMap.get(category);

    const existingPost =
      creatorMap.get(creatorId);

    if (!existingPost) {
      creatorMap.set(
        creatorId,
        scoredPost
      );

      continue;
    }

    const comparison =
      compareRankedPosts(
        scoredPost,
        existingPost
      );

    if (comparison < 0) {
      creatorMap.set(
        creatorId,
        scoredPost
      );
    }
  }

  const categoryRankings = {};

  for (const [
    category,
    creatorMap,
  ] of categoryMap.entries()) {
    categoryRankings[category] =
      Array.from(
        creatorMap.values()
      ).sort(compareRankedPosts);
  }

  return categoryRankings;
};

export {
  getCategoryRanking,
};