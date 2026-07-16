import { useCallback, useEffect, useState } from "react";
import AuthLoadingState from "../components/AuthLoadingState";
import AuthErrorState from "../components/AuthErrorState";
import {
	getDashboardErrorMessage,
	getTopArtists,
} from "../services/spotifyService";
import "../styles/dashboard.css";

function TopArtistsPage() { // Component that displays the user's top artists from Spotify
	const [artists, setArtists] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadTopArtists = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getTopArtists();
			setArtists(data?.items ?? []);
		} catch (err) {
			setArtists([]);
			setError(getDashboardErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTopArtists();
	}, [loadTopArtists]);

	if (isLoading) {
		return <AuthLoadingState message="Loading top artists…" />;
	}

	if (error) {
		return <AuthErrorState message={error} onRetry={loadTopArtists} />;
	}

	return (
		<section className="dashboard-page" aria-labelledby="top-artists-heading">
			<h1 id="top-artists-heading" className="dashboard-page__title">
				Top Artists
			</h1>

			{artists.length === 0 ? (
				<p className="dashboard-empty">No top artists found.</p>
			) : (
				<ul className="dashboard-list">
					{artists.map((artist) => (
						<li key={artist.id} className="dashboard-card">
							{artist.images?.[0]?.url ? (
								<img
									className="dashboard-card__image dashboard-card__image--round"
									src={artist.images[0].url}
									alt={artist.name}
								/>
							) : null}

							<div className="dashboard-card__content">
								<h2 className="dashboard-card__title">{artist.name}</h2>
								<p className="dashboard-card__meta">
									{artist.genres?.length
										? artist.genres.join(", ")
										: "No genres listed"}
								</p>
								<p className="dashboard-card__meta">
									Popularity: {artist.popularity ?? 0}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

export default TopArtistsPage;
