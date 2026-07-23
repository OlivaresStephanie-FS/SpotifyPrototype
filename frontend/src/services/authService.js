import api from "./api";

/**
 * Checks authentication status against the backend.
 * The backend (MongoDB-stored Spotify tokens) is the source of truth.
 */
export async function getAuthenticationStatus() {
	const response = await api.get("/auth/status");
	const authenticated = Boolean(response.data?.authenticated);

	return {
		authenticated,
		message: response.data?.message ?? null,
	};
}

/**
 * Clears the backend-stored Spotify authentication record.
 * Tokens are never returned to the frontend.
 */
export async function logoutAuthentication() {
	const response = await api.post("/auth/logout");

	return {
		authenticated: Boolean(response.data?.authenticated),
		message: response.data?.message ?? "Logged out successfully.",
	};
}
