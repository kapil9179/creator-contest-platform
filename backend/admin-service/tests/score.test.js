import { describe, it, expect } from "vitest";

import { calculatePostScore } from "../src/utils/ranking/score.utils";

describe("calculatePostScore", () => {
  it("calculates score correctly", () => {
    const post = {
      likesCount: 100,
      commentsCount: 20,
      viewsCount: 500,
    };

    const score = calculatePostScore(post);

    expect(score).toBe(260);
  });

  it("handles missing counts as zero", () => {
    const post = {};

    const score = calculatePostScore(post);

    expect(score).toBe(0);
  });
});