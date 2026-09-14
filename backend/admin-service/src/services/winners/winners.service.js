import prisma from "../../configs/db/prisma.config.js";
import { getRankings } from "../ranking/ranking.service.js";
import createApiError from "../../utils/apierror.js";
const generateWinnersService = async () => {
  // Prevent accidental regeneration
  const existingWinnerCount = await prisma.winner.count();

  if (existingWinnerCount > 0) {
    throw createApiError(
      409,
      "Winners have already been generated"
    );
  }

  const rankings = await getRankings();

  const prizeAllocation =
    rankings.prizeAllocation || [];

  // Unawarded category slots are not actual winners
  const validWinners = prizeAllocation.filter(
    (winner) =>
      winner.userId &&
      !winner.unawarded
  );

  if (!validWinners.length) {
    throw createApiError(
      400,
      "No eligible winners found"
    );
  }

  const winnerData = validWinners.map(
    (winner) => ({
      userId: winner.userId,
      tier: winner.tier,
      category: winner.category || null,
      kycStatus: "NOT_REQUESTED",
    })
  );

  await prisma.winner.createMany({
    data: winnerData,
  });

  return prisma.winner.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
};

const getWinnersService = async () => {
  return prisma.winner.findMany({
    where: {
      kycStatus: {
        not: "FAILED",
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

export {
  generateWinnersService,
  getWinnersService,
};