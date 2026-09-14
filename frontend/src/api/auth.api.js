import { request, USER_SERVICE_URL } from "./apiClient";

export const signup = (payload) =>
  request(USER_SERVICE_URL, "/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const login = (payload) =>
  request(USER_SERVICE_URL, "/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
