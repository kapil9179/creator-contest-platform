import { describe, it, expect } from "vitest";

import {
  getCategoryRanking,
} from "../src/services/ranking/categoryranking.service.js";

describe("getCategoryRanking", () => {
  it("keeps best post per creator per category", () => {
    const posts = [
      {
        _id: "dance1",
        creator: {
          _id: "user1",
          residency: "Chhattisgarh",
        },
        category: "dance",
        likesCount: 100,
        commentsCount: 10,
        viewsCount: 100,
        createdAt: "2026-09-01T10:00:00.000Z",
      },

      {
        _id: "dance2",
        creator: {
          _id: "user1",
          residency: "Chhattisgarh",
        },
        category: "dance",
        likesCount: 500,
        commentsCount: 20,
        viewsCount: 500,
        createdAt: "2026-09-02T10:00:00.000Z",
      },

      {
        _id: "music1",
        creator: {
          _id: "user1",
          residency: "Chhattisgarh",
        },
        category: "music",
        likesCount: 300,
        commentsCount: 20,
        viewsCount: 300,
        createdAt: "2026-09-03T10:00:00.000Z",
      },
    ];

    const rankings =
      getCategoryRanking(posts);

    expect(rankings.dance).toHaveLength(1);
    expect(rankings.dance[0]._id).toBe(
      "dance2"
    );

    expect(rankings.music).toHaveLength(1);
    expect(rankings.music[0]._id).toBe(
      "music1"
    );
  });
});