import { useEffect, useState } from "react";
import { createPost } from "../api/post.api";
import {
  ALLOWED_MEDIA_TYPES,
  MAX_MEDIA_SIZE_BYTES,
  POST_CATEGORIES,
} from "../constants/categories";
import { useAuth } from "../context/AuthContext.jsx";
import MediaPreview from "../components/MediaPreview.jsx";

const formatFileSize = (bytes) => `${Math.round(bytes / 1024 / 1024)} MB`;

const CreatePost = () => {
  const { token } = useAuth();
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(POST_CATEGORIES[0]);
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!media) {
      setPreviewUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(media);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [media]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setMessage("");
    setMedia(null);

    if (!file) return;

    if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
      setError("Use JPEG, PNG, WEBP, MP4, or WEBM media only");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_MEDIA_SIZE_BYTES) {
      setError(`Media must be ${formatFileSize(MAX_MEDIA_SIZE_BYTES)} or less`);
      event.target.value = "";
      return;
    }

    setMedia(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!media) {
      setError("Media is required");
      return;
    }

    if (!caption.trim()) {
      setError("Caption is required");
      return;
    }

    const formData = new FormData();
    formData.append("media", media);
    formData.append("caption", caption.trim());
    formData.append("category", category);

    setLoading(true);
    try {
      const response = await createPost(token, formData);
      setMessage(response.message);
      setCaption("");
      setCategory(POST_CATEGORIES[0]);
      setMedia(null);
      event.target.reset();
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

  return (
    <main className="page narrow">
      <section className="panel">
        <h1>Create Post</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Media
            <input
              type="file"
              accept={ALLOWED_MEDIA_TYPES.join(",")}
              onChange={handleFileChange}
            />
          </label>

          <MediaPreview url={previewUrl} type={media?.type} />

          <label>
            Caption
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              rows="4"
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {POST_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <p className="hint">
            Accepted media: JPEG, PNG, WEBP, MP4, WEBM. Maximum size: 20 MB.
          </p>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Posting..." : "Create Post"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreatePost;
