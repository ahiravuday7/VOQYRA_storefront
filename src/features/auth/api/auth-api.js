import { apiClient } from "@/lib/api-client";

async function login(credentials) {
  const response = await apiClient.post("/auth/login", credentials);

  return response.data;
}

async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");

  return response.data;
}

async function refreshSession() {
  const response = await apiClient.post("/auth/refresh");

  return response.data;
}

async function logout() {
  const response = await apiClient.post("/auth/logout");

  return response.data;
}

export { getCurrentUser, login, logout, refreshSession };
