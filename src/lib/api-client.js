import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

const refreshExcludedPaths = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

function isRefreshExcludedRequest(url = "") {
  return refreshExcludedPaths.some((path) => url.includes(path));
}

function normalizeApiError(error) {
  const response = error?.response;
  const responseData = response?.data;

  return {
    status: response?.status ?? null,

    code: responseData?.code ?? responseData?.error?.code ?? error?.code ?? null,

    message:
      responseData?.message ??
      responseData?.error?.message ??
      error?.message ??
      "Something went wrong.",

    details: responseData?.details ?? responseData?.error?.details ?? null,

    fieldErrors: responseData?.fieldErrors ?? responseData?.errors ?? null,

    originalError: error,
  };
}

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = refreshClient.post("/auth/refresh").finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    const shouldAttemptRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshExcludedRequest(originalRequest.url);

    if (shouldAttemptRefresh) {
      originalRequest._retry = true;

      try {
        await refreshSession();

        return apiClient(originalRequest);
      } catch {
        return Promise.reject(normalizeApiError(error));
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export { apiClient, normalizeApiError };
