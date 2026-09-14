import { describe, it, expect } from "vitest";

import {
  findReplacementCandidate,
} from "../src/services/kyc/kyc.service.js";

describe("KYC cascade", () => {
  it("selects next eligible global candidate after KYC failure", () => {
    const failedWinner = {
      tier: "GRAND_PRIZE",
      userId: "A",
    };

    const rankings = {
      globalRanking: [
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
      ],

      categoryRanking: {},
      consistencyRanking: [],
    };

    const excludedUserIds =
      new Set(["A"]);

    const replacement =
      findReplacementCandidate({
        failedWinner,
        rankings,
        excludedUserIds,
      });

    expect(
      String(replacement.creator._id)
    ).toBe("B");
  });

  it("skips multiple previously awarded or failed users", () => {
    const failedWinner = {
      tier: "GRAND_PRIZE",
      userId: "A",
    };

    const rankings = {
      globalRanking: [
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
      ],

      categoryRanking: {},
      consistencyRanking: [],
    };

    const excludedUserIds =
      new Set(["A", "B"]);

    const replacement =
      findReplacementCandidate({
        failedWinner,
        rankings,
        excludedUserIds,
      });

    expect(
      String(replacement.creator._id)
    ).toBe("C");
  });
});