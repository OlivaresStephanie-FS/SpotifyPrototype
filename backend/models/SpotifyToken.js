import mongoose from "mongoose";

const spotifyTokenSchema = new mongoose.Schema(
	{
		accessToken: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
			required: true,
		},
		tokenType: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
); // Defining a Mongoose schema for the SpotifyToken model, which includes fields for access token, refresh token, token type, and expiration date, along with automatic timestamping for creation and update times

const SpotifyToken = mongoose.model("SpotifyToken", spotifyTokenSchema);

export default SpotifyToken;
