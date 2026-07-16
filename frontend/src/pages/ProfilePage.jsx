import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthLoadingState from "../components/AuthLoadingState";
import AuthErrorState from "../components/AuthErrorState";
import {
	getDashboardErrorMessage,
	getProfile,
	getTopArtists,
	getTopTracks,
} from "../services/spotifyService";
import "../styles/dashboard.css";

function ProfilePage() { // Component that displays the user's Spotify profile information
	const [profile, setProfile] = useState(null);
	const [artists, setArtists] = useState([]);
	const [tracks, setTracks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState({
		profile: null,
		artists: null,
		tracks: null,
	});

	const loadDashboard = useCallback(async () => {
		setIsLoading(true);
		setErrors({ profile: null, artists: null, tracks: null });

		try {
			const [profileResult, artistsResult, tracksResult] =
				await Promise.allSettled([
					getProfile(),
					getTopArtists(),
					getTopTracks(),
				]);

			setProfile(
				profileResult.status === "fulfilled" ? profileResult.value : null,
			);
			setArtists(
				artistsResult.status === "fulfilled"
					? (artistsResult.value?.items ?? []).slice(0, 5)
					: [],
			);
			setTracks(
				tracksResult.status === "fulfilled"
					? (tracksResult.value?.items ?? []).slice(0, 5)
					: [],
			);
			setErrors({
				profile:
					profileResult.status === "rejected"
						? getDashboardErrorMessage(profileResult.reason)
						: null,
				artists:
					artistsResult.status === "rejected"
						? getDashboardErrorMessage(artistsResult.reason)
						: null,
				tracks:
					tracksResult.status === "rejected"
						? getDashboardErrorMessage(tracksResult.reason)
						: null,
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDashboard();
	}, [loadDashboard]);

	if (isLoading) {
		return <AuthLoadingState message="Loading profile…" />;
	}

	if (errors.profile) {
		return (
			<AuthErrorState message={errors.profile} onRetry={loadDashboard} />
		);
	}

	const profileImage = profile?.images?.[0]?.url;
	const profileUrl = profile?.external_urls?.spotify;

	return (
		<section
			className="dashboard-page dashboard-page--profile"
			aria-labelledby="profile-heading"
		>
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
							className="dashboard-card__link dashboard-card__link--spotify"
							href={profileUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							View on Spotify
						</a>
					) : null}
				</div>
			</div>

			<div className="dashboard-previews">
				<section
					className="dashboard-preview"
					aria-labelledby="profile-artists-heading"
				>
					<div className="dashboard-preview__header">
						<div>
							<p className="dashboard-preview__eyebrow">In rotation</p>
							<h2
								id="profile-artists-heading"
								className="dashboard-preview__title"
							>
								Top Artists
							</h2>
						</div>
						<Link className="dashboard-preview__link" to="/top-artists">
							View All
						</Link>
					</div>

					{errors.artists ? (
						<AuthErrorState
							message={errors.artists}
							onRetry={loadDashboard}
						/>
					) : artists.length === 0 ? (
						<p className="dashboard-empty dashboard-empty--compact">
							No top artists found yet.
						</p>
					) : (
						<ul className="dashboard-preview__list">
							{artists.map((artist) => (
								<li key={artist.id} className="dashboard-preview-card">
									{artist.images?.[0]?.url ? (
										<img
											className="dashboard-preview-card__image dashboard-preview-card__image--round"
											src={artist.images[0].url}
											alt=""
										/>
									) : null}
									<h3 className="dashboard-preview-card__title">
										{artist.name}
									</h3>
								</li>
							))}
						</ul>
					)}
				</section>

				<section
					className="dashboard-preview"
					aria-labelledby="profile-tracks-heading"
				>
					<div className="dashboard-preview__header">
						<div>
							<p className="dashboard-preview__eyebrow">Most played</p>
							<h2
								id="profile-tracks-heading"
								className="dashboard-preview__title"
							>
								Top Tracks
							</h2>
						</div>
						<Link className="dashboard-preview__link" to="/top-tracks">
							View All
						</Link>
					</div>

					{errors.tracks ? (
						<AuthErrorState
							message={errors.tracks}
							onRetry={loadDashboard}
						/>
					) : tracks.length === 0 ? (
						<p className="dashboard-empty dashboard-empty--compact">
							No top tracks found yet.
						</p>
					) : (
						<ul className="dashboard-preview__list">
							{tracks.map((track) => (
								<li key={track.id} className="dashboard-preview-card">
									{track.album?.images?.[0]?.url ? (
										<img
											className="dashboard-preview-card__image"
											src={track.album.images[0].url}
											alt=""
										/>
									) : null}
									<div className="dashboard-preview-card__content">
										<h3 className="dashboard-preview-card__title">
											{track.name}
										</h3>
										<p className="dashboard-preview-card__meta">
											{track.artists
												?.map((artist) => artist.name)
												.join(", ") || "Unknown artist"}
										</p>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>
			</div>
		</section>
	);
}

export default ProfilePage;
