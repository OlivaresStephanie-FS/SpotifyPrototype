import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import SpotifyToken from "./models/SpotifyToken.js";
import {
	getValidAccessToken,
	SpotifyAuthRequiredError,
	SpotifyTokenServiceError,
} from "./services/spotifyToken.js";

dotenv.config(); // Load environment variables from .env file
connectDatabase(); // Connect to MongoDB database

const app = express();

const PORT = process.env.PORT || 3000;

function frontendRedirect(path) { // Function to construct the frontend redirect URL for the given path
	const base = process.env.FRONTEND_URL || "http://localhost:5173";

	return `${base.replace(/\/$/, "")}${path}`;
}

app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "Spotify Prototype API is running",
		environment: process.env.NODE_ENV || "development",
	});
}); // Define a route for the root URL that responds with a JSON message indicating that the Spotify Prototype API is running, along with the current environment (development or production)

const SPOTIFY_SCOPES =
	"user-read-private user-read-email user-follow-read user-library-read";

function buildSpotifyAuthorizeUrl({ showDialog = false } = {}) {
	const authUrl = new URL("https://accounts.spotify.com/authorize");

	authUrl.searchParams.append("response_type", "code");
	authUrl.searchParams.append("client_id", process.env.SPOTIFY_CLIENT_ID);
	authUrl.searchParams.append("scope", SPOTIFY_SCOPES);
	authUrl.searchParams.append(
		"redirect_uri",
		process.env.SPOTIFY_REDIRECT_URI,
	);

	if (showDialog) {
		authUrl.searchParams.append("show_dialog", "true");
	}

	return authUrl.toString();
}

app.get("/login", (req, res) => { // Route to initiate the Spotify authorization flow by redirecting the user to the Spotify authorization URL
	res.redirect(buildSpotifyAuthorizeUrl());
});

app.get("/reauthorize", (req, res) => { // Route to initiate the Spotify reauthorization flow by redirecting the user to the Spotify authorization URL with the show_dialog parameter set to true
	res.redirect(buildSpotifyAuthorizeUrl({ showDialog: true }));
});

app.get("/callback", async (req, res) => { // Route to handle the callback from Spotify after the user authorizes the application, exchanging the authorization code for an access token and refresh token, and storing them in the database
	const code = req.query.code;
	const spotifyError = req.query.error;

	if (spotifyError === "access_denied") {
		return res.redirect(
			frontendRedirect("/login?error=access_denied"),
		);
	}

	if (spotifyError) {
		return res.redirect(
			frontendRedirect("/login?error=authorization_failed"),
		);
	}

	if (!code) {
		return res.redirect(frontendRedirect("/login?error=missing_code"));
	}

	const credentials = Buffer.from(
		`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
	).toString("base64"); // Encoding the client ID and client secret in base64 for the Authorization header

	const body = new URLSearchParams({
		grant_type: "authorization_code",
		code,
		redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
	}); // Creating the request body for the token exchange request, including the grant type, authorization code, and redirect URI

	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
		}); // Sending a POST request to the Spotify token endpoint to exchange the authorization code for an access token and refresh token

		const data = await response.json();

		if (!response.ok) {
			return res.redirect(
				frontendRedirect("/login?error=exchange_failed"),
			);
		} // If the response is not OK, redirect to the frontend login page with an error

		const expiresAt = new Date(Date.now() + data.expires_in * 1000);

		await SpotifyToken.create({
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			tokenType: data.token_type,
			expiresAt,
		});

		return res.redirect(frontendRedirect("/search"));
	} catch (error) {
		return res.redirect(frontendRedirect("/login?error=server_error"));
	}
}); // Catch any server errors during the token exchange process and redirect to the frontend login page

app.get("/auth/status", async (req, res) => {
	try {
		await getValidAccessToken();

		return res.status(200).json({
			authenticated: true,
		});
	} catch (error) {
		if (error instanceof SpotifyAuthRequiredError) {
			return res.status(200).json({
				authenticated: false,
				message: error.message,
			});
		}

		if (error instanceof SpotifyTokenServiceError) {
			return res.status(503).json({
				error: "Authentication status temporarily unavailable.",
			});
		}

		return res.status(503).json({
			error: "Authentication status temporarily unavailable.",
		});
	}
});

async function fetchSpotifyApi(spotifyPath, res) {
	try {
		const accessToken = await getValidAccessToken();

		let response;
		let responseText = "";
		let data;

		try {
			response = await fetch(`https://api.spotify.com/v1${spotifyPath}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			responseText = await response.text();

			const trimmedBody = responseText.trim();
			const appearsToBeJson =
				trimmedBody.startsWith("{") || trimmedBody.startsWith("[");

			if (appearsToBeJson) {
				try {
					data = JSON.parse(trimmedBody);
				} catch {
					data = undefined;
				}
			}
		} catch {
			return res.status(503).json({
				error: "Spotify service temporarily unavailable.",
			});
		}

		if (response.ok) {
			return res.status(200).json(data);
		}

		if (response.status === 401) {
			return res.status(401).json({
				error: "Spotify authentication required.",
				message: "Please sign in with Spotify again to continue.",
			});
		}

		const bodyTextLower = responseText.toLowerCase();
		const jsonMessageLower = String(
			data?.error?.message || "",
		).toLowerCase();

		if (
			response.status === 403 &&
			(bodyTextLower.includes("premium subscription") ||
				jsonMessageLower.includes("premium subscription"))
		) {
			return res.status(403).json({
				error: "spotify_premium_required",
				message:
					"Spotify currently requires the developer app owner to have an active Premium subscription before Web API requests are allowed.",
			});
		}

		if (
			response.status === 403 &&
			(data?.error?.reason === "INSUFFICIENT_SCOPE" ||
				jsonMessageLower.includes("insufficient") ||
				bodyTextLower.includes("insufficient"))
		) {
			return res.status(403).json({
				error: "Additional Spotify permissions required.",
				message:
					"Please sign in with Spotify again so the new OAuth scope can be granted.",
			});
		}

		if (response.status >= 500 || response.status === 429) {
			return res.status(503).json({
				error: "Spotify service temporarily unavailable.",
			});
		}

		return res.status(response.status).json({
			error: "Spotify request failed.",
		});
	} catch (error) {
		if (error instanceof SpotifyAuthRequiredError) {
			return res.status(401).json({
				error: "Spotify authentication required.",
				message: error.message,
			});
		}

		if (error instanceof SpotifyTokenServiceError) {
			return res.status(503).json({
				error: "Spotify service temporarily unavailable.",
			});
		}

		return res.status(503).json({
			error: "Spotify service temporarily unavailable.",
		});
	}
}

app.get("/api/spotify/profile", async (req, res) => {
	return fetchSpotifyApi("/me", res);
});

app.get("/api/spotify/followed-artists", async (req, res) => {
	return fetchSpotifyApi("/me/following?type=artist&limit=20", res);
});

app.get("/api/spotify/saved-tracks", async (req, res) => {
	return fetchSpotifyApi("/me/tracks?limit=20", res);
});

const SEARCH_TYPES = new Set(["artist", "album", "track"]);

function formatArtistNames(artists) {
	if (!Array.isArray(artists) || artists.length === 0) {
		return null;
	}

	return artists
		.map((artist) => artist?.name)
		.filter(Boolean)
		.join(", ");
}

function normalizeSearchResult(item, type) {
	let image = null;
	let subtitle = null;

	if (type === "artist") {
		image = item.images?.[0]?.url ?? null;
		subtitle =
			Array.isArray(item.genres) && item.genres.length > 0
				? item.genres.slice(0, 3).join(", ")
				: null;
	} else if (type === "album") {
		image = item.images?.[0]?.url ?? null;
		subtitle = formatArtistNames(item.artists);
	} else if (type === "track") {
		image = item.album?.images?.[0]?.url ?? null;
		const artists = formatArtistNames(item.artists);
		const albumName = item.album?.name || null;
		subtitle = [artists, albumName].filter(Boolean).join(" • ") || null;
	}

	return {
		id: item.id,
		name: item.name,
		type: item.type || type,
		image,
		subtitle,
		external_urls: {
			spotify: item.external_urls?.spotify ?? null,
		},
	};
}

app.get("/api/spotify/search", async (req, res) => {
	const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
	const type =
		typeof req.query.type === "string" ? req.query.type.trim().toLowerCase() : "";

	if (!q) {
		return res.status(400).json({
			error: "Search query is required.",
			message: 'Provide a non-empty "q" query parameter.',
		});
	}

	if (!SEARCH_TYPES.has(type)) {
		return res.status(400).json({
			error: "Invalid search type.",
			message: 'Supported types are "artist", "album", and "track".',
		});
	}

	const params = new URLSearchParams({
		q,
		type,
		limit: "10",
	});

	try {
		const accessToken = await getValidAccessToken();

		let response;
		let responseText = "";
		let data;

		try {
			response = await fetch(
				`https://api.spotify.com/v1/search?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			responseText = await response.text();

			const trimmedBody = responseText.trim();
			const appearsToBeJson =
				trimmedBody.startsWith("{") || trimmedBody.startsWith("[");

			if (appearsToBeJson) {
				try {
					data = JSON.parse(trimmedBody);
				} catch {
					data = undefined;
				}
			}
		} catch {
			return res.status(503).json({
				error: "Spotify service temporarily unavailable.",
			});
		}

		if (response.ok) {
			const collectionKey = `${type}s`;
			const items = data?.[collectionKey]?.items ?? [];
			const results = items
				.filter((item) => item && item.id)
				.map((item) => normalizeSearchResult(item, type));

			return res.status(200).json({
				q,
				type,
				results,
			});
		}

		const spotifyErrorMessage =
			typeof data?.error?.message === "string" ? data.error.message : null;
		const spotifyErrorReason =
			typeof data?.error?.reason === "string" ? data.error.reason : null;

		console.error("[spotify/search] upstream failure", {
			status: response.status,
			spotifyErrorMessage,
			spotifyErrorReason,
			queryLength: q.length,
			type,
		});

		if (response.status === 401) {
			return res.status(401).json({
				error: "Spotify authentication required.",
				message: "Please sign in with Spotify again to continue.",
			});
		}

		const bodyTextLower = responseText.toLowerCase();
		const jsonMessageLower = String(spotifyErrorMessage || "").toLowerCase();

		if (
			response.status === 403 &&
			(bodyTextLower.includes("premium subscription") ||
				jsonMessageLower.includes("premium subscription"))
		) {
			return res.status(403).json({
				error: "spotify_premium_required",
				message:
					"Spotify currently requires the developer app owner to have an active Premium subscription before Web API requests are allowed.",
			});
		}

		if (
			response.status === 403 &&
			(spotifyErrorReason === "INSUFFICIENT_SCOPE" ||
				jsonMessageLower.includes("insufficient") ||
				bodyTextLower.includes("insufficient"))
		) {
			return res.status(403).json({
				error: "Additional Spotify permissions required.",
				message:
					"Please sign in with Spotify again so the new OAuth scope can be granted.",
			});
		}

		if (response.status >= 500 || response.status === 429) {
			return res.status(503).json({
				error: "Spotify service temporarily unavailable.",
			});
		}

		return res.status(response.status).json({
			error: "Spotify request failed.",
			message: spotifyErrorMessage || "Unable to complete Spotify search.",
		});
	} catch (error) {
		if (error instanceof SpotifyAuthRequiredError) {
			return res.status(401).json({
				error: "Spotify authentication required.",
				message: error.message,
			});
		}

		if (error instanceof SpotifyTokenServiceError) {
			return res.status(503).json({
				error: "Spotify service temporarily unavailable.",
			});
		}

		return res.status(503).json({
			error: "Spotify service temporarily unavailable.",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Spotify Prototype API running on port ${PORT}`);
}); // Start the Express server and listen on the specified port, logging a message to indicate that the server is running
