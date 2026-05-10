"use client";

type AuthUser = {
  id: string;
  email: string;
  role: "admin" | "user";
};

type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  details?: {
    fieldErrors?: Record<string, string[]>;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/v1";

function getAuthUrl(path: string) {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}

function getValidationMessage(response: ApiResponse<unknown>) {
  const fieldErrors = response.details?.fieldErrors;
  const firstError = fieldErrors && Object.values(fieldErrors).flat()[0];
  return firstError ?? response.message ?? "Something went wrong. Please try again.";
}

async function postAuth<T>(path: string, body: Record<string, string>): Promise<T> {
  const response = await fetch(getAuthUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(getValidationMessage(payload));
  }

  return payload.data;
}

export function saveAuthSession(session: AuthPayload) {
  localStorage.setItem("clearcut_access_token", session.accessToken);
  localStorage.setItem("clearcut_refresh_token", session.refreshToken);
  localStorage.setItem("clearcut_user", JSON.stringify(session.user));
}

export function registerUser(payload: { name: string; email: string; password: string }) {
  return postAuth<AuthPayload>("/auth/register", payload);
}

export function loginUser(payload: { email: string; password: string }) {
  return postAuth<AuthPayload>("/auth/login", payload);
}
