const compareRankedPosts = (a, b) => {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  if (b.commentsCount !== a.commentsCount) {
    return b.commentsCount - a.commentsCount;
  }

  if (b.viewsCount !== a.viewsCount) {
    return b.viewsCount - a.viewsCount;
  }

  return (
    new Date(a.createdAt).getTime() -
    new Date(b.createdAt).getTime()
  );
};

export {
  compareRankedPosts,
};