import { fetchContestData } from "../contest/contestdata.service.js";
import { getGlobalRanking } from "./globalranking.service.js";
import { getCategoryRanking } from "./categoryranking.service.js";
import { getConsistencyRanking } from "./consistencyranking.service.js";
import { allocatePrizes } from "../prize/prize.allocation.service.js";

const getRankings = async () => {
  // User Service se contest data
  const posts = await fetchContestData();

  // Contest start date
  const contestStartDate = process.env.CONTEST_START_DATE;

  // 1. Global Ranking
  const globalRanking =
    getGlobalRanking(posts);

  // 2. Category Ranking
  const categoryRanking =
    getCategoryRanking(posts);

  // 3. Consistency Ranking
  const consistencyRanking =
    getConsistencyRanking(
      posts,
      contestStartDate
    );

  // 4. Prize Allocation
  const prizeAllocation =
    allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
    });

  return {
    globalRanking,
    categoryRanking,
    consistencyRanking,
    prizeAllocation,
  };
};

export {
  getRankings,
};