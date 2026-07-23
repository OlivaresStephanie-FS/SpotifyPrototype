import crypto from "crypto";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import {
	getValidAccessToken,
	clearStoredSpotifyTokenForUser,
	upsertSpotifyTokenForUser,
	SpotifyAuthRequiredError,
	SpotifyTokenServiceError,
} from "./services/spotifyToken.js";

dotenv.config();
connectDatabase();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET) {
	console.error("SESSION_SECRET is required.");
	process.exit(1);
}

if (!process.env.MONGODB_URI) {
	console.error("MONGODB_URI is required.");
	process.exit(1);
}

function frontendOrigin() {
	return (process.env.FRONTEND_URL || "http://localhost:5173").replace(
		/\/$/,
		"",
	);
}

function frontendRedirect(path) {
	return `${frontendOrigin()}${path}`;
}

function getSessionSpotifyUserId(req) {
	return typeof req.session?.spotifyUserId === "string"
		? req.session.spotifyUserId
		: null;
}

async function getValidAccessTokenForRequest(req) {
	const spotifyUserId = getSessionSpotifyUserId(req);

	if (!spotifyUserId) {
		throw new SpotifyAuthRequiredError("No authenticated session.");
	}

	return getValidAccessToken(spotifyUserId);
}

// Render (and similar hosts) terminate TLS upstream; required for secure cookies.
app.set("trust proxy", 1);

app.use(
	cors({
		origin: frontendOrigin(),
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type"],
		credentials: true,
	}),
);

app.use(express.json());

const sessionCookie = {
	httpOnly: true,
	secure: isProduction,
	sameSite: isProduction ? "none" : "lax",
	maxAge: 1000 * 60 * 60 * 24 * 7,
};

app.use(
	session({
		name: "spotify.sid",
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
		}),
		cookie: sessionCookie,
	}),
);

app.get("/", (req, res) => {
	res.json({
		message: "Spotify Prototype API is running",
		environment: process.env.NODE_ENV || "development",
	});
});

const SPOTIFY_SCOPES =
	"user-read-private user-read-email user-follow-read user-library-read";

function buildSpotifyAuthorizeUrl({ showDialog = false, state } = {}) {
	const authUrl = new URL("https://accounts.spotify.com/authorize");

	authUrl.searchParams.append("response_type", "code");
	authUrl.searchParams.append("client_id", process.env.SPOTIFY_CLIENT_ID);
	authUrl.searchParams.append("scope", SPOTIFY_SCOPES);
	authUrl.searchParams.append(
		"redirect_uri",
		process.env.SPOTIFY_REDIRECT_URI,
	);
	authUrl.searchParams.append("state", state);

	if (showDialog) {
		authUrl.searchParams.append("show_dialog", "true");
	}

	return authUrl.toString();
}

function beginSpotifyAuthorization(req, res, { showDialog = false } = {}) {
	const state = crypto.randomBytes(16).toString("hex");
	req.session.oauthState = state;

	req.session.save((error) => {
		if (error) {
			return res.redirect(frontendRedirect("/login?error=server_error"));
		}

		return res.redirect(buildSpotifyAuthorizeUrl({ showDialog, state }));
	});
}

app.get("/login", (req, res) => {
	beginSpotifyAuthorization(req, res);
});

app.get("/reauthorize", (req, res) => {
	beginSpotifyAuthorization(req, res, { showDialog: true });
});

app.get("/callback", async (req, res) => {
	const code = req.query.code;
	const returnedState = req.query.state;
	const spotifyError = req.query.error;

	if (spotifyError === "access_denied") {
		return res.redirect(frontendRedirect("/login?error=access_denied"));
	}

	if (spotifyError) {
		return res.redirect(
			frontendRedirect("/login?error=authorization_failed"),
		);
	}

	if (!code) {
		return res.redirect(frontendRedirect("/login?error=missing_code"));
	}

	if (
		!returnedState ||
		typeof returnedState !== "string" ||
		returnedState !== req.session?.oauthState
	) {
		return res.redirect(
			frontendRedirect("/login?error=authorization_failed"),
		);
	}

	delete req.session.oauthState;

	const credentials = Buffer.from(
		`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
	).toString("base64");

	const body = new URLSearchParams({
		grant_type: "authorization_code",
		code,
		redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
	});

	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
		});

		const data = await response.json();

		if (!response.ok) {
			return res.redirect(
				frontendRedirect("/login?error=exchange_failed"),
			);
		}

		const profileResponse = await fetch("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${data.access_token}`,
			},
		});

		const profile = await profileResponse.json();

		if (!profileResponse.ok || !profile?.id) {
			return res.redirect(frontendRedirect("/login?error=server_error"));
		}

		const expiresAt = new Date(Date.now() + data.expires_in * 1000);

		await upsertSpotifyTokenForUser({
			spotifyUserId: profile.id,
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			tokenType: data.token_type,
			expiresAt,
		});

		req.session.spotifyUserId = profile.id;

		req.session.save((error) => {
			if (error) {
				return res.redirect(
					frontendRedirect("/login?error=server_error"),
				);
			}

			return res.redirect(frontendRedirect("/"));
		});
	} catch {
		return res.redirect(frontendRedirect("/login?error=server_error"));
	}
});

app.get("/auth/status", async (req, res) => {
	try {
		await getValidAccessTokenForRequest(req);

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

app.post("/auth/logout", async (req, res) => {
	const spotifyUserId = getSessionSpotifyUserId(req);

	try {
		if (spotifyUserId) {
			await clearStoredSpotifyTokenForUser(spotifyUserId);
		}

		req.session.destroy((error) => {
			res.clearCookie("spotify.sid", {
				httpOnly: sessionCookie.httpOnly,
				secure: sessionCookie.secure,
				sameSite: sessionCookie.sameSite,
			});

			if (error) {
				return res.status(503).json({
					error: "Logout temporarily unavailable.",
				});
			}

			return res.status(200).json({
				authenticated: false,
				message: "Logged out successfully.",
			});
		});
	} catch (error) {
		if (error instanceof SpotifyTokenServiceError) {
			return res.status(503).json({
				error: "Logout temporarily unavailable.",
			});
		}

		return res.status(503).json({
			error: "Logout temporarily unavailable.",
		});
	}
});

async function fetchSpotifyApi(spotifyPath, req, res) {
	try {
		const accessToken = await getValidAccessTokenForRequest(req);

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
	return fetchSpotifyApi("/me", req, res);
});

app.get("/api/spotify/followed-artists", async (req, res) => {
	return fetchSpotifyApi("/me/following?type=artist&limit=20", req, res);
});

app.get("/api/spotify/saved-tracks", async (req, res) => {
	return fetchSpotifyApi("/me/tracks?limit=20", req, res);
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
		const accessToken = await getValidAccessTokenForRequest(req);

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
});
