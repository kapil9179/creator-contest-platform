import { authHeaders, request, USER_SERVICE_URL } from "./apiClient";

export const updateResidency = (token, residency) =>
  request(USER_SERVICE_URL, "/api/user/residency", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ residency }),
  });
