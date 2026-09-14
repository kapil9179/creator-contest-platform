import { describe, it, expect } from "vitest";

import { compareRankedPosts } from "../src/utils/ranking/compare.ranking";

describe("compareRankedPosts", () => {
  it("ranks higher score first", () => {
    const posts = [
      {
        score: 100,
        commentsCount: 5,
        viewsCount: 100,
        createdAt: "2026-09-01T10:00:00.000Z",
      },
      {
        score: 200,
        commentsCount: 1,
        viewsCount: 10,
        createdAt: "2026-09-01T11:00:00.000Z",
      },
    ];

    posts.sort(compareRankedPosts);

    expect(posts[0].score).toBe(200);
  });

  it("uses comments as first tie-break", () => {
    const posts = [
      {
        score: 200,
        commentsCount: 10,
        viewsCount: 500,
        createdAt: "2026-09-01T10:00:00.000Z",
      },
      {
        score: 200,
        commentsCount: 20,
        viewsCount: 100,
        createdAt: "2026-09-01T11:00:00.000Z",
      },
    ];

    posts.sort(compareRankedPosts);

    expect(posts[0].commentsCount).toBe(20);
  });

  it("uses views when comments are tied", () => {
    const posts = [
      {
        score: 200,
        commentsCount: 20,
        viewsCount: 100,
        createdAt: "2026-09-01T10:00:00.000Z",
      },
      {
        score: 200,
        commentsCount: 20,
        viewsCount: 300,
        createdAt: "2026-09-01T11:00:00.000Z",
      },
    ];

    posts.sort(compareRankedPosts);

    expect(posts[0].viewsCount).toBe(300);
  });

  it("uses earliest timestamp as final tie-break", () => {
    const posts = [
      {
        score: 200,
        commentsCount: 20,
        viewsCount: 300,
        createdAt: "2026-09-01T11:00:00.000Z",
      },
      {
        score: 200,
        commentsCount: 20,
        viewsCount: 300,
        createdAt: "2026-09-01T09:00:00.000Z",
      },
    ];

    posts.sort(compareRankedPosts);

    expect(posts[0].createdAt).toBe(
      "2026-09-01T09:00:00.000Z"
    );
  });
});