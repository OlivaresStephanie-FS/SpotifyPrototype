import { useCallback, useEffect, useState } from "react";
import AuthLoadingState from "../components/AuthLoadingState";
import AuthErrorState from "../components/AuthErrorState";
import {
	getDashboardErrorMessage,
	getProfile,
} from "../services/spotifyService";
import "../styles/dashboard.css";

function ProfilePage() { // Component that displays the user's Spotify profile information
	const [profile, setProfile] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadProfile = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getProfile();
			setProfile(data);
		} catch (err) {
			setProfile(null);
			setError(getDashboardErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	if (isLoading) {
		return <AuthLoadingState message="Loading profile…" />;
	}

	if (error) {
		return <AuthErrorState message={error} onRetry={loadProfile} />;
	}

	const profileImage = profile?.images?.[0]?.url;
	const profileUrl = profile?.external_urls?.spotify;

	return (
		<section className="dashboard-page" aria-labelledby="profile-heading">
			<h1 id="profile-heading" className="dashboard-page__title">
				Profile
			</h1>

			<div className="dashboard-profile">
				{profileImage ? (
					<img
						className="dashboard-card__image dashboard-card__image--round dashboard-card__image--profile"
						src={profileImage}
						alt={profile?.display_name || "Spotify profile"}
					/>
				) : null}

				<div className="dashboard-card__content">
					<h2 className="dashboard-card__title">
						{profile?.display_name || "Spotify User"}
					</h2>
					<p className="dashboard-card__meta">
						{profile?.followers?.total ?? 0} followers
					</p>
					{profileUrl ? (
						<a
							className="dashboard-card__link"
							href={profileUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							View on Spotify
						</a>
					) : null}
				</div>
			</div>
		</section>
	);
}

export default ProfilePage;
