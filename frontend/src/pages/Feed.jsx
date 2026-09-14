import { useEffect, useState } from "react";
import { fetchPosts } from "../api/post.api";
import PostCard from "../components/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Feed = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPosts = async (nextPage = page) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchPosts(token, nextPage, 10);
      setPosts(response.data.posts || []);
      setPagination(response.data.pagination);
      setPage(nextPage);
    } catch (err) {
      if (err.status === 401) {
        window.dispatchEvent(new Event("auth:unauthorized"));
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, [token]);

  const updatePost = (updatedPost) => {
    if (!updatedPost?._id) return;
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? { ...post, ...updatedPost } : post
      )
    );
  };

  return (
    <main className="page">
      <div className="page-title">
        <div>
          <h1>Feed</h1>
          <p className="muted">Latest creator contest posts</p>
        </div>
        <button type="button" className="button secondary" onClick={() => loadPosts(page)}>
          Refresh
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading posts...</p>}

      {!loading && posts.length === 0 && !error && (
        <section className="panel empty-state">
          <h2>No posts yet</h2>
          <p className="muted">Create the first contest post to get started.</p>
        </section>
      )}

      <div className="feed-grid">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onPostUpdated={updatePost} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="button secondary"
            disabled={page <= 1 || loading}
            onClick={() => loadPosts(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="button secondary"
            disabled={page >= pagination.totalPages || loading}
            onClick={() => loadPosts(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default Feed;
