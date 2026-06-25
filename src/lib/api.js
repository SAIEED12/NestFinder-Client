// 📄 Location: src/lib/api.js
import { authClient } from "@/lib/auth-client";

/**
 * Custom fetch wrapper that automatically injects the JWT Bearer token
 * into protected administrative, tenant, and owner API routes.
 */
export async function secureFetch(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  
  // 💡 Pull the active token directly from better-auth client-side store
  const session = authClient.getActions().getSession?.() || authClient.useSession?.()?.data;
  const token = session?.token || localStorage.getItem("better-auth.session-token"); 

  // Initialize and merge headers safely
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 🛡️ Append the Bearer token dynamically if it exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, config);

  if (response.status === 401) {
    console.warn("Session expired or token invalid. Redirecting to authentication terminal...");
    // Optional: handle automatic logout or route push to /login here
  }

  return response;
}