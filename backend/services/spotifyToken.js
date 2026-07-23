import SpotifyToken from "../models/SpotifyToken.js";

export class SpotifyAuthRequiredError extends Error {
	constructor(message) {
		super(message);
		this.name = "SpotifyAuthRequiredError";
		this.code = "AUTHENTICATION_REQUIRED";
	}
}

export class SpotifyTokenServiceError extends Error {
	constructor(message) {
		super(message);
		this.name = "SpotifyTokenServiceError";
		this.code = "TEMPORARY_FAILURE";
	}
}

/**
 * Returns a usable Spotify access token, refreshing and persisting when expired.
 */
export async function getValidAccessToken() {
	const token = await SpotifyToken.findOne().sort({ createdAt: -1 });

	if (!token) {
		throw new SpotifyAuthRequiredError("No Spotify token found.");
	}

	if (token.expiresAt > new Date()) {
		return token.accessToken;
	}

	if (!token.refreshToken) {
		throw new SpotifyAuthRequiredError(
			"No Spotify refresh token found. Re-authentication is required.",
		);
	}

	const credentials = Buffer.from(
		`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
	).toString("base64");

	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: token.refreshToken,
	});

	let response;
	let data;

	try {
		response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
		});

		data = await response.json();
	} catch {
		throw new SpotifyTokenServiceError(
			"Failed to reach Spotify token endpoint.",
		);
	}

	if (!response.ok) {
		if (response.status === 400 || response.status === 401) {
			throw new SpotifyAuthRequiredError(
				"Spotify rejected the refresh request. Re-authentication is required.",
			);
		}

		throw new SpotifyTokenServiceError(
			"Spotify token refresh request failed.",
		);
	}

	if (!data.access_token || typeof data.expires_in !== "number") {
		throw new SpotifyTokenServiceError(
			"Spotify refresh response was missing required token fields.",
		);
	}

	token.accessToken = data.access_token;
	token.expiresAt = new Date(Date.now() + data.expires_in * 1000);

	if (data.refresh_token) {
		token.refreshToken = data.refresh_token;
	}

	if (data.token_type) {
		token.tokenType = data.token_type;
	}

	try {
		await token.save();
	} catch {
		throw new SpotifyTokenServiceError(
			"Failed to save refreshed Spotify token.",
		);
	}

	return token.accessToken;
}

/**
 * Removes all stored Spotify authentication records.
 * Idempotent: succeeds even when no tokens exist.
 */
export async function clearStoredSpotifyTokens() {
	try {
		await SpotifyToken.deleteMany({});
	} catch {
		throw new SpotifyTokenServiceError(
			"Failed to clear stored Spotify authentication.",
		);
	}
}
