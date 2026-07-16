import api from "./api";

export function getDashboardErrorMessage(error) { // Function to generate user-friendly error messages based on the error response from the backend
	const status = error?.response?.status;
	const data = error?.response?.data;

	if (status === 401) {
		return "Please sign in with Spotify again to continue.";
	}

	if (typeof data?.message === "string" && data.message) {
		return data.message;
	}

	if (status === 503) {
		return "Spotify data is temporarily unavailable. Please try again.";
	}

	return "Unable to load Spotify data. Please try again.";
}

export async function getProfile() {
	const response = await api.get("/api/spotify/profile");

	return response.data;
}

export async function getFollowedArtists() {
	const response = await api.get("/api/spotify/followed-artists");

	return response.data;
}

export async function getSavedTracks() {
	const response = await api.get("/api/spotify/saved-tracks");

	return response.data;
}
