import { useEffect, useRef, useState } from "react";
import { addComment, likePost, recordView } from "../api/post.api";
import { USER_SERVICE_URL } from "../api/apiClient";
import { useAuth } from "../context/AuthContext.jsx";

const buildMediaUrl = (mediaPath) => {
  if (!mediaPath) return "";
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;
  return `${USER_SERVICE_URL}/${mediaPath.replace(/^\/+/, "")}`;
};

const isVideoPath = (mediaPath) => /\.(mp4|webm)$/i.test(mediaPath || "");

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, { dateStyle: "medium" }) : "";

const PostCard = ({ post, onPostUpdated }) => {
  const { token } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [message, setMessage] = useState("");
  const viewedRef = useRef(false);
  const mediaUrl = buildMediaUrl(post.media);

  useEffect(() => {
    if (!token || viewedRef.current || !post._id) return;
    viewedRef.current = true;
    recordView(token, post._id)
      .then((response) => onPostUpdated(response.data))
      .catch(() => {
        viewedRef.current = false;
      });
  }, [token, post._id]);

  const runAction = async (action, callback) => {
    setBusyAction(action);
    setMessage("");

    try {
      await callback();
    } catch (error) {
      if (error.status === 401) {
        window.dispatchEvent(new Event("auth:unauthorized"));
        return;
      }
      setMessage(error.message);
    } finally {
      setBusyAction("");
    }
  };

  const handleLike = () =>
    runAction("like", async () => {
      const response = await likePost(token, post._id);
      onPostUpdated(response.data);
      setMessage(response.message);
    });

  const handleComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) {
      setMessage("Comment cannot be empty");
      return;
    }

    runAction("comment", async () => {
      await addComment(token, post._id, text);
      setCommentText("");
      onPostUpdated({
        ...post,
        commentsCount: (post.commentsCount || 0) + 1,
      });
      setMessage("Comment added successfully");
    });
  };

  return (
    <article className="post-card">
      <div className="post-meta">
        <div>
          <strong>{post.creator?.email || "Creator"}</strong>
          <span>{post.creator?.residency || "Residency not set"}</span>
        </div>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      {isVideoPath(post.media) ? (
        <video className="post-media" src={mediaUrl} controls />
      ) : (
        <img className="post-media" src={mediaUrl} alt={post.caption} />
      )}

      <div className="post-body">
        <span className="pill">{post.category}</span>
        <p>{post.caption}</p>

        <div className="post-stats">
          <span>{post.likesCount || 0} likes</span>
          <span>{post.commentsCount || 0} comments</span>
          <span>{post.viewsCount || 0} views</span>
        </div>

        <div className="post-actions">
          <button
            type="button"
            className="button secondary"
            onClick={handleLike}
            disabled={busyAction === "like"}
          >
            {busyAction === "like" ? "Liking..." : "Like"}
          </button>
        </div>

        <form className="comment-form" onSubmit={handleComment}>
          <input
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a comment"
          />
          <button
            type="submit"
            className="button"
            disabled={busyAction === "comment"}
          >
            {busyAction === "comment" ? "Posting..." : "Comment"}
          </button>
        </form>

        {message && <p className="inline-message">{message}</p>}
      </div>
    </article>
  );
};

export default PostCard;
