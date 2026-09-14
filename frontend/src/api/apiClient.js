export const USER_SERVICE_URL =
  import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:5001";

export const ADMIN_SERVICE_URL =
  import.meta.env.VITE_ADMIN_SERVICE_URL || "http://localhost:5002";

const getMessage = (payload, fallback) => {
  if (payload?.message) return payload.message;
  if (Array.isArray(payload?.errors) && payload.errors.length) {
    return payload.errors.join(", ");
  }
  return fallback;
};

export const unwrapResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(getMessage(payload, "Request failed"));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

export const request = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  return unwrapResponse(response);
};

export const authHeaders = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
