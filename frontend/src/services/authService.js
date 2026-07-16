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
