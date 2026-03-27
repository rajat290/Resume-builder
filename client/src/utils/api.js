const STORAGE_KEY = "smart-resume-builder-auth";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export class ApiConnectionError extends Error {
  constructor(message = "Cannot connect to the backend server.") {
    super(message);
    this.name = "ApiConnectionError";
  }
}

export function isApiConnectionError(error) {
  return error instanceof ApiConnectionError || error?.name === "ApiConnectionError";
}

export const authStorage = {
  get() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  set(session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export async function apiFetch(path, options = {}) {
  const session = authStorage.get();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  try {
    return await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
  } catch (_error) {
    throw new ApiConnectionError();
  }
}

export async function checkApiHealth() {
  const response = await apiFetch("/health", {
    method: "GET",
    headers: {}
  });
  return response.ok;
}
