import { ADMIN_SERVICE_URL, request } from "./apiClient";

export const fetchWinners = () => request(ADMIN_SERVICE_URL, "/api/winners");

export const generateWinners = () =>
  request(ADMIN_SERVICE_URL, "/api/winners/generate", {
    method: "POST",
  });

export const requestKyc = (winnerId) =>
  request(ADMIN_SERVICE_URL, `/api/kyc/${winnerId}/request`, {
    method: "PATCH",
  });

export const passKyc = (winnerId) =>
  request(ADMIN_SERVICE_URL, `/api/kyc/${winnerId}/pass`, {
    method: "PATCH",
  });

export const failKyc = (winnerId) =>
  request(ADMIN_SERVICE_URL, `/api/kyc/${winnerId}/fail`, {
    method: "PATCH",
  });
