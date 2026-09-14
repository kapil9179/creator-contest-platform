import prisma from "../../configs/db/prisma.config.js";
import { getRankings } from "../ranking/ranking.service.js";
import createApiError from "../../utils/apierror.js";
const findReplacementCandidate = ({
  failedWinner,
  rankings,
  excludedUserIds,
}) => {
  const {
    globalRanking,
    categoryRanking,
    consistencyRanking,
  } = rankings;

  if (failedWinner.tier === "GRAND_PRIZE") {
    return globalRanking.find(
      (candidate) =>
        !excludedUserIds.has(
          String(candidate.creator._id)
        )
    );
  }

  if (
    failedWinner.tier === "CONSISTENCY_FIRST" ||
    failedWinner.tier === "CONSISTENCY_SECOND"
  ) {
    return consistencyRanking.find(
      (candidate) =>
        !excludedUserIds.has(
          String(candidate.creatorId)
        )
    );
  }

  if (failedWinner.tier === "TOP_PERFORMER") {
    return globalRanking.find(
      (candidate) =>
        !excludedUserIds.has(
          String(candidate.creator._id)
        )
    );
  }

  if (
    failedWinner.tier === "CATEGORY_FIRST" ||
    failedWinner.tier === "CATEGORY_SECOND"
  ) {
    const candidates =
      categoryRanking[failedWinner.category] || [];

    return candidates.find(
      (candidate) =>
        !excludedUserIds.has(
          String(candidate.creator._id)
        )
    );
  }

  return null;
};

const requestKycService = async (winnerId) => {
  const winner = await prisma.winner.findUnique({
    where: {
      id: Number(winnerId),
    },
  });

  if (!winner) {
    throw createApiError(404, "Winner not found");
  }

  if (winner.kycStatus === "FAILED") {
    throw createApiError(
      400,
      "KYC already failed for this winner"
    );
  }

  if (winner.kycStatus === "PASSED") {
    throw createApiError(
      400,
      "KYC already passed"
    );
  }

  return prisma.winner.update({
    where: {
      id: winner.id,
    },
    data: {
      kycStatus: "REQUESTED",
    },
  });
};

const passKycService = async (winnerId) => {
  const winner = await prisma.winner.findUnique({
    where: {
      id: Number(winnerId),
    },
  });

  if (!winner) {
    throw createApiError(404, "Winner not found");
  }

  if (winner.kycStatus !== "REQUESTED") {
    throw createApiError(
      400,
      "KYC must be requested before it can be passed"
    );
  }

  return prisma.winner.update({
    where: {
      id: winner.id,
    },
    data: {
      kycStatus: "PASSED",
    },
  });
};

const failKycService = async (winnerId) => {
  const winner = await prisma.winner.findUnique({
    where: {
      id: Number(winnerId),
    },
  });

  if (!winner) {
    throw createApiError(404, "Winner not found");
  }

  if (winner.kycStatus !== "REQUESTED") {
    throw createApiError(
      400,
      "KYC must be requested before it can be failed"
    );
  }

  const rankings = await getRankings();

  const allWinnerRecords =
    await prisma.winner.findMany({
      select: {
        userId: true,
      },
    });

  const excludedUserIds = new Set(
    allWinnerRecords.map(
      (item) => item.userId
    )
  );

  const replacement =
    findReplacementCandidate({
      failedWinner: winner,
      rankings,
      excludedUserIds,
    });

  return prisma.$transaction(async (tx) => {
    const failedWinner =
      await tx.winner.update({
        where: {
          id: winner.id,
        },
        data: {
          kycStatus: "FAILED",
        },
      });

    if (!replacement) {
      return {
        failedWinner,
        replacementWinner: null,
        slotUnawarded: true,
      };
    }

    const replacementUserId = String(
      replacement.creatorId ||
      replacement.creator?._id
    );

    const replacementWinner =
      await tx.winner.create({
        data: {
          userId: replacementUserId,
          tier: winner.tier,
          category: winner.category || null,
          kycStatus: "NOT_REQUESTED",
        },
      });

    return {
      failedWinner,
      replacementWinner,
      slotUnawarded: false,
    };
  });
};

export {
  requestKycService,
  passKycService,
  failKycService,
  findReplacementCandidate
};