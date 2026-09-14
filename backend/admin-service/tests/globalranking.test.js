import { describe, it, expect } from "vitest";

import {
  getGlobalRanking,
} from "../src/services/ranking/globalranking.service.js";

describe("getGlobalRanking", () => {
  it("keeps only best post per creator", () => {
    const posts = [
      {
        _id: "post1",
        creator: {
          _id: "user1",
          residency: "Chhattisgarh",
        },
        likesCount: 100,
        commentsCount: 10,
        viewsCount: 100,
        createdAt: "2026-09-01T10:00:00.000Z",
      },

      {
        _id: "post2",
        creator: {
          _id: "user1",
          residency: "Chhattisgarh",
        },
        likesCount: 500,
        commentsCount: 20,
        viewsCount: 500,
        createdAt: "2026-09-02T10:00:00.000Z",
      },
    ];

    const ranking = getGlobalRanking(posts);

    expect(ranking).toHaveLength(1);
    expect(ranking[0]._id).toBe("post2");
  });

  it("excludes non-Chhattisgarh creators", () => {
    const posts = [
      {
        _id: "post1",
        creator: {
          _id: "user1",
          residency: "Madhya Pradesh",
        },
        likesCount: 10000,
        commentsCount: 10000,
        viewsCount: 10000,
        createdAt: "2026-09-01T10:00:00.000Z",
      },

      {
        _id: "post2",
        creator: {
          _id: "user2",
          residency: "Chhattisgarh",
        },
        likesCount: 10,
        commentsCount: 10,
        viewsCount: 10,
        createdAt: "2026-09-01T10:00:00.000Z",
      },
    ];

    const ranking = getGlobalRanking(posts);

    expect(ranking).toHaveLength(1);
    expect(
      String(ranking[0].creator._id)
    ).toBe("user2");
  });
});