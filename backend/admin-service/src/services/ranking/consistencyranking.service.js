import { calculatePostScore } from "../../utils/ranking/score.utils.js";

const getWeekNumber = (createdAt, contestStartDate) => {
  const postDate = new Date(createdAt);
  const startDate = new Date(contestStartDate);

  const diffInMs =
    postDate.getTime() - startDate.getTime();

  const diffInDays = Math.floor(
    diffInMs / (1000 * 60 * 60 * 24)
  );

  return Math.floor(diffInDays / 7) + 1;
};

const getConsistencyRanking = (
  posts,
  contestStartDate
) => {
  const creatorWeeks = new Map();

  for (const post of posts) {
    if (
      !post.creator ||
      post.creator.residency !== "Chhattisgarh"
    ) {
      continue;
    }

    const week = getWeekNumber(
      post.createdAt,
      contestStartDate
    );

    // Only contest weeks 1-4
    if (week < 1 || week > 4) {
      continue;
    }

    const creatorId = String(
      post.creator._id
    );

    if (!creatorWeeks.has(creatorId)) {
      creatorWeeks.set(creatorId, {
        creator: post.creator,
        weeks: {
          1: [],
          2: [],
          3: [],
          4: [],
        },
      });
    }

    creatorWeeks
      .get(creatorId)
      .weeks[week]
      .push({
        ...post,
        score: calculatePostScore(post),
      });
  }

  const ranking = [];

  for (const [
    creatorId,
    creatorData,
  ] of creatorWeeks.entries()) {
    const { weeks } = creatorData;

    const isEligible =
      weeks[1].length >= 3 &&
      weeks[2].length >= 3 &&
      weeks[3].length >= 3 &&
      weeks[4].length >= 3;

    if (!isEligible) {
      continue;
    }

    let consistencyScore = 0;

    const weeklyScores = {};

    for (let week = 1; week <= 4; week++) {
      const topThreePosts = weeks[week]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const weekScore =
        topThreePosts.reduce(
          (total, post) =>
            total + post.score,
          0
        );

      weeklyScores[week] = weekScore;

      consistencyScore += weekScore;
    }

    ranking.push({
      creatorId,
      creator: creatorData.creator,
      consistencyScore,
      weeklyScores,
    });
  }

  ranking.sort(
    (a, b) =>
      b.consistencyScore -
      a.consistencyScore
  );

  return ranking;
};

export {
  getConsistencyRanking,
};