// 📄 Location: src/lib/api.js
import { authClient } from "@/lib/auth-client";

/**
 * Authenticated fetch wrapper — automatically injects JWT Bearer token
 * using better-auth's jwtClient plugin (.getToken())
 */
export async function secureFetch(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // ✅ Correct way to get JWT token with jwtClient plugin
  const token = await authClient.getToken();

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn("Token expired or unauthorized — redirecting to login.");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return response;
}