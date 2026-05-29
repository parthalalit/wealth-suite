const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Retrieve token from local storage or session if using Supabase client auth
  const token = localStorage.getItem("supabase_session_token") || "mock_token_for_local_dev";

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `HTTP API request failed with status: ${response.status}`);
  }

  return response.json();
}
