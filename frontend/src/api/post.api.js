import { authHeaders, request, USER_SERVICE_URL } from "./apiClient";

export const createPost = (token, formData) =>
  request(USER_SERVICE_URL, "/api/posts", {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

export const fetchPosts = (token, page = 1, limit = 10) =>
  request(USER_SERVICE_URL, `/api/posts/fetch?page=${page}&limit=${limit}`, {
    headers: authHeaders(token),
  });

export const likePost = (token, postId) =>
  request(USER_SERVICE_URL, `/api/posts/${postId}/like`, {
    method: "POST",
    headers: authHeaders(token),
  });

export const addComment = (token, postId, text) =>
  request(USER_SERVICE_URL, `/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ text }),
  });

export const recordView = (token, postId) =>
  request(USER_SERVICE_URL, `/api/posts/${postId}/view`, {
    method: "POST",
    headers: authHeaders(token),
  });
