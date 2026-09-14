// src/services/prize/prizeAllocation.service.js

const allocateCategoryTier = ({
  categoryRanking,
  awardedUsers,
  tier,
}) => {
  const winners = [];

  const categories = Object.keys(categoryRanking);

  for (const category of categories) {
    const candidates = categoryRanking[category] || [];

    let selected = null;

    for (const candidate of candidates) {
      const userId = String(candidate.creator._id);

      if (awardedUsers.has(userId)) {
        continue;
      }

      selected = candidate;
      break;
    }

    if (!selected) {
      winners.push({
        userId: null,
        tier,
        category,
        unawarded: true,
      });

      continue;
    }

    const userId = String(selected.creator._id);

    awardedUsers.add(userId);

    winners.push({
      userId,
      tier,
      category,
      score: selected.score,
    });
  }

  return winners;
};

const allocatePrizes = ({
  globalRanking,
  categoryRanking,
  consistencyRanking,
}) => {
  const winners = [];
  const awardedUsers = new Set();

  const addWinner = (
    entry,
    tier,
    category = null
  ) => {
    if (!entry) return false;

    const userId = String(
      entry.creatorId ||
      entry.creator?._id
    );

    if (!userId || awardedUsers.has(userId)) {
      return false;
    }

    awardedUsers.add(userId);

    winners.push({
      userId,
      tier,
      category,
      score:
        entry.consistencyScore ??
        entry.score ??
        0,
    });

    return true;
  };

  // 1. Grand Prize
  for (const entry of globalRanking) {
    if (addWinner(entry, "GRAND_PRIZE")) {
      break;
    }
  }

  // 2. Consistency First
  for (const entry of consistencyRanking) {
    if (addWinner(entry, "CONSISTENCY_FIRST")) {
      break;
    }
  }

  // 3. Consistency Second
  for (const entry of consistencyRanking) {
    if (addWinner(entry, "CONSISTENCY_SECOND")) {
      break;
    }
  }

  // 4. Top 10 Performers
  let topCount = 0;

  for (const entry of globalRanking) {
    if (topCount >= 10) {
      break;
    }

    if (addWinner(entry, "TOP_PERFORMER")) {
      topCount++;
    }
  }

  // 5. Category First
  const categoryFirstWinners =
    allocateCategoryTier({
      categoryRanking,
      awardedUsers,
      tier: "CATEGORY_FIRST",
    });

  winners.push(...categoryFirstWinners);

  // 6. Category Second
  const categorySecondWinners =
    allocateCategoryTier({
      categoryRanking,
      awardedUsers,
      tier: "CATEGORY_SECOND",
    });

  winners.push(...categorySecondWinners);

  return winners;
};

export {
  allocatePrizes,
};