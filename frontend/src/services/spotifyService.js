import api from "./api";

export function getDashboardErrorMessage(error) {
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

export async function getTopArtists() {
	const response = await api.get("/api/spotify/top-artists");

	return response.data;
}

export async function getTopTracks() {
	const response = await api.get("/api/spotify/top-tracks");

	return response.data;
}
