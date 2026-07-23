import mongoose from "mongoose";

const spotifyTokenSchema = new mongoose.Schema(
	{
		spotifyUserId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
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
);

const SpotifyToken = mongoose.model("SpotifyToken", spotifyTokenSchema);

export default SpotifyToken;
