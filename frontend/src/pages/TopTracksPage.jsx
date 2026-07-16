import { useCallback, useEffect, useState } from "react";
import AuthLoadingState from "../components/AuthLoadingState";
import AuthErrorState from "../components/AuthErrorState";
import {
	getDashboardErrorMessage,
	getTopTracks,
} from "../services/spotifyService";
import "../styles/dashboard.css";

function TopTracksPage() { // Component that displays the user's top tracks from Spotify
	const [tracks, setTracks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadTopTracks = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getTopTracks();
			setTracks(data?.items ?? []);
		} catch (err) {
			setTracks([]);
			setError(getDashboardErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTopTracks();
	}, [loadTopTracks]);

	if (isLoading) {
		return <AuthLoadingState message="Loading top tracks…" />;
	}

	if (error) {
		return <AuthErrorState message={error} onRetry={loadTopTracks} />;
	}

	return (
		<section className="dashboard-page" aria-labelledby="top-tracks-heading">
			<h1 id="top-tracks-heading" className="dashboard-page__title">
				Top Tracks
			</h1>

			{tracks.length === 0 ? (
				<p className="dashboard-empty">No top tracks found.</p>
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
											className="dashboard-card__link"
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

export default TopTracksPage;
