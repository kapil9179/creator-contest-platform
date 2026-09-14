import { describe, it, expect } from "vitest";

import {
  getConsistencyRanking,
} from "../src/services/ranking/consistencyranking.service.js";

const creator = {
  _id: "creator1",
  residency: "Chhattisgarh",
};

const createPost = (
  id,
  createdAt,
  scoreBase = 100
) => ({
  _id: id,
  creator,
  category: "fitness",
  likesCount: scoreBase,
  commentsCount: 10,
  viewsCount: 100,
  createdAt,
});

describe("getConsistencyRanking", () => {
  it("includes creator with 3+ posts in all four weeks", () => {
    const posts = [];

    const weekDates = [
      "2026-09-01",
      "2026-09-08",
      "2026-09-15",
      "2026-09-22",
    ];

    weekDates.forEach((date, weekIndex) => {
      for (let i = 0; i < 3; i++) {
        posts.push(
          createPost(
            `post-${weekIndex}-${i}`,
            `${date}T1${i}:00:00.000Z`,
            100 + i
          )
        );
      }
    });

    const ranking =
      getConsistencyRanking(
        posts,
        "2026-09-01T00:00:00.000Z"
      );

    expect(ranking).toHaveLength(1);
    expect(ranking[0].creatorId).toBe(
      "creator1"
    );
  });

  it("excludes creator with fewer than 3 posts in one week", () => {
    const posts = [];

    const weekDates = [
      "2026-09-01",
      "2026-09-08",
      "2026-09-15",
      "2026-09-22",
    ];

    weekDates.forEach((date, weekIndex) => {
      const count =
        weekIndex === 3 ? 2 : 3;

      for (let i = 0; i < count; i++) {
        posts.push(
          createPost(
            `post-${weekIndex}-${i}`,
            `${date}T1${i}:00:00.000Z`
          )
        );
      }
    });

    const ranking =
      getConsistencyRanking(
        posts,
        "2026-09-01T00:00:00.000Z"
      );

    expect(ranking).toHaveLength(0);
  });
});