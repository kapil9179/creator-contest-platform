import { describe, it, expect } from "vitest";

import {
  allocatePrizes,
} from "../src/services/prize/prize.allocation.service.js";

const globalRanking = [
  {
    creator: { _id: "A" },
    score: 1000,
  },
  {
    creator: { _id: "B" },
    score: 900,
  },
  {
    creator: { _id: "C" },
    score: 800,
  },
  {
    creator: { _id: "D" },
    score: 700,
  },
  {
    creator: { _id: "E" },
    score: 600,
  },
];

const consistencyRanking = [
  {
    creatorId: "A",
    consistencyScore: 4000,
  },
  {
    creatorId: "B",
    consistencyScore: 3500,
  },
  {
    creatorId: "C",
    consistencyScore: 3000,
  },
];

const categoryRanking = {
  dance: [
    {
      creator: { _id: "A" },
      score: 1000,
    },
    {
      creator: { _id: "D" },
      score: 700,
    },
  ],

  music: [
    {
      creator: { _id: "A" },
      score: 900,
    },
    {
      creator: { _id: "E" },
      score: 600,
    },
  ],

  photography: [
    {
      creator: { _id: "B" },
      score: 500,
    },
  ],
};

describe("allocatePrizes", () => {
  it("does not award more than one prize per user", () => {
    const winners = allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
    });

    const userIds = winners
      .filter((winner) => winner.userId)
      .map((winner) => winner.userId);

    const uniqueIds =
      new Set(userIds);

    expect(uniqueIds.size).toBe(
      userIds.length
    );
  });

  it("awards grand prize before other tiers", () => {
    const winners = allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
    });

    const grandPrize = winners.find(
      (winner) =>
        winner.tier === "GRAND_PRIZE"
    );

    expect(grandPrize.userId).toBe("A");
  });

  it("cascades when higher ranked user already won", () => {
    const winners = allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
    });

    const consistencyFirst =
      winners.find(
        (winner) =>
          winner.tier ===
          "CONSISTENCY_FIRST"
      );

    expect(
      consistencyFirst.userId
    ).not.toBe("A");

    expect(
      consistencyFirst.userId
    ).toBe("B");
  });

  it("leaves exhausted category slot unawarded", () => {
    const winners = allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
    });

    const unawarded =
      winners.filter(
        (winner) =>
          winner.unawarded === true
      );

    expect(
      unawarded.length
    ).toBeGreaterThan(0);
  });
});