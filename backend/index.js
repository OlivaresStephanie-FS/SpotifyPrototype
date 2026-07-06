import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import SpotifyToken from "./models/SpotifyToken.js";

dotenv.config(); // Load environment variables from .env file
connectDatabase(); // Connect to MongoDB database

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "Spotify Prototype API is running",
		environment: process.env.NODE_ENV || "development",
	});
}); // Define a route for the root URL that responds with a JSON message indicating that the Spotify Prototype API is running, along with the current environment (development or production)

app.get("/login", (req, res) => {
	const scope = "user-read-private user-read-email";

	const authUrl = new URL("https://accounts.spotify.com/authorize"); // Creating a new URL object for the Spotify authorization endpoint

	authUrl.searchParams.append("response_type", "code"); // Adding query parameters to the URL
	authUrl.searchParams.append("client_id", process.env.SPOTIFY_CLIENT_ID); // Adding the client ID from environment variables
	authUrl.searchParams.append("scope", scope); // Adding the requested scopes for the authorization
	authUrl.searchParams.append(
		"redirect_uri",
		process.env.SPOTIFY_REDIRECT_URI,
	); // Adding the redirect URI from environment variables

	res.redirect(authUrl.toString());
});

app.get("/callback", async (req, res) => {
	const code = req.query.code; // Extracting the authorization code from the query parameters of the callback request

	if (!code) {
		return res.status(400).json({
			error: "Authorization code is missing.",
		});
	} // If the authorization code is missing, return a 400 Bad Request response with an error message

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
			return res.status(response.status).json({
				error: "Failed to exchange authorization code.",
				details: data,
			});
		} // If the response is not OK, return the status code and error details from Spotify

		const expiresAt = new Date(Date.now() + data.expires_in * 1000);

		await SpotifyToken.create({
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			tokenType: data.token_type,
			expiresAt,
		});

		return res.json({
			message:
				"Spotify authentication successful. Token saved to database.",
			token_type: data.token_type,
			expires_in: data.expires_in,
			expires_at: expiresAt,
			access_token_received: Boolean(data.access_token),
			refresh_token_received: Boolean(data.refresh_token),
		}); // Return a JSON response indicating that the Spotify authentication was successful, along with details about the token type, expiration time, and whether the access and refresh tokens were received
	} catch (error) {
		return res.status(500).json({
			error: "Server error during Spotify authentication.",
			details: error.message,
		});
	}
}); // Catch any server errors during the token exchange process and return a 500 Internal Server Error response with the error message

app.get("/auth/status", async (req, res) => {
  const token = await SpotifyToken.findOne().sort({ createdAt: -1 });

  if (!token) {
    return res.json({
      authenticated: false,
      message: "No Spotify token found.",
    });
  }

  return res.json({
    authenticated: true,
    token_type: token.tokenType,
    expires_at: token.expiresAt,
    is_expired: token.expiresAt <= new Date(),
  });
});

app.listen(PORT, () => {
	console.log(`Spotify Prototype API running on port ${PORT}`);
}); // Start the Express server and listen on the specified port, logging a message to indicate that the server is running
