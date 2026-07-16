import { useCallback, useEffect, useState } from "react";
import AuthLoadingState from "../components/AuthLoadingState";
import AuthErrorState from "../components/AuthErrorState";
import {
	getDashboardErrorMessage,
	getSavedTracks,
} from "../services/spotifyService";
import "../styles/dashboard.css";

function SavedTracksPage() {
	const [tracks, setTracks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadSavedTracks = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getSavedTracks();
			setTracks(
				(data?.items ?? [])
					.map((item) => item?.track)
					.filter(Boolean),
			);
		} catch (err) {
			setTracks([]);
			setError(getDashboardErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadSavedTracks();
	}, [loadSavedTracks]);

	if (isLoading) {
		return <AuthLoadingState message="Loading saved tracks…" />;
	}

	if (error) {
		return <AuthErrorState message={error} onRetry={loadSavedTracks} />;
	}

	return (
		<section
			className="dashboard-page"
			aria-labelledby="saved-tracks-heading"
		>
			<h1 id="saved-tracks-heading" className="dashboard-page__title">
				Liked Songs
			</h1>

			{tracks.length === 0 ? (
				<p className="dashboard-empty">No saved tracks found.</p>
			) : (
				<ul className="dashboard-list">
					{tracks.map((track) => {
						const artistNames =
							track.artists?.map((artist) => artist.name).join(", ") ||
							"Unknown artist";
						const trackUrl = track.external_urls?.spotify;

						return (
							<li key={track.id} className="dashboard-card">
								{track.album?.images?.[0]?.url ? (
									<img
										className="dashboard-card__image"
										src={track.album.images[0].url}
										alt={track.album.name || track.name}
									/>
								) : null}

								<div className="dashboard-card__content">
									<h2 className="dashboard-card__title">{track.name}</h2>
									<p className="dashboard-card__meta">{artistNames}</p>
									<p className="dashboard-card__meta">
										{track.album?.name || "Unknown album"}
									</p>
									{trackUrl ? (
										<a
											className="dashboard-card__link dashboard-card__link--spotify"
											href={trackUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Open in Spotify
										</a>
									) : null}
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}

export default SavedTracksPage;
