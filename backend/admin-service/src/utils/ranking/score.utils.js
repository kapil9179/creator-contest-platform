const calculatePostScore = (post) => {
  const likes = post.likesCount || 0;
  const comments = post.commentsCount || 0;
  const views = post.viewsCount || 0;

  return (
    likes * 1 +
    comments * 3 +
    views * 0.2
  );
};

export {
  calculatePostScore,
};







