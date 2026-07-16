import { useCallback, useEffect, useState } from "react";
import AuthLoadingState from "../components/AuthLoadingState";
import AuthErrorState from "../components/AuthErrorState";
import {
	getDashboardErrorMessage,
	getFollowedArtists,
} from "../services/spotifyService";
import "../styles/dashboard.css";

function formatFollowerCount(total) {
	if (typeof total !== "number" || Number.isNaN(total)) {
		return "Followers unavailable";
	}

	if (total >= 1_000_000) {
		const millions = total / 1_000_000;
		const formatted =
			millions >= 10
				? millions.toFixed(0)
				: millions.toFixed(1).replace(/\.0$/, "");
		return `${formatted}M followers`;
	}

	if (total >= 1_000) {
		const thousands = total / 1_000;
		const formatted =
			thousands >= 10
				? thousands.toFixed(0)
				: thousands.toFixed(1).replace(/\.0$/, "");
		return `${formatted}K followers`;
	}

	return `${total} followers`;
}

function formatArtistGenres(genres) {
	if (!Array.isArray(genres) || genres.length === 0) {
		return "Genres unavailable";
	}

	return genres.slice(0, 3).join(", ");
}

function FollowedArtistsPage() {
	const [artists, setArtists] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadFollowedArtists = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getFollowedArtists();
			setArtists(data?.artists?.items ?? []);
		} catch (err) {
			setArtists([]);
			setError(getDashboardErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadFollowedArtists();
	}, [loadFollowedArtists]);

	if (isLoading) {
		return <AuthLoadingState message="Loading followed artists…" />;
	}

	if (error) {
		return (
			<AuthErrorState message={error} onRetry={loadFollowedArtists} />
		);
	}

	return (
		<section
			className="dashboard-page"
			aria-labelledby="followed-artists-heading"
		>
			<h1 id="followed-artists-heading" className="dashboard-page__title">
				Followed Artists
			</h1>

			{artists.length === 0 ? (
				<p className="dashboard-empty">No followed artists found.</p>
			) : (
				<ul className="dashboard-list">
					{artists.map((artist) => {
						const artistUrl = artist.external_urls?.spotify;

						return (
							<li key={artist.id} className="dashboard-card">
								{artist.images?.[0]?.url ? (
									<img
										className="dashboard-card__image dashboard-card__image--round"
										src={artist.images[0].url}
										alt={artist.name}
									/>
								) : null}

								<div className="dashboard-card__content">
									<h2 className="dashboard-card__title">
										{artist.name}
									</h2>
									<p className="dashboard-card__meta">
										{formatArtistGenres(artist.genres)}
									</p>
									<p className="dashboard-card__meta">
										{formatFollowerCount(artist.followers?.total)}
									</p>
									{artistUrl ? (
										<a
											className="dashboard-card__link dashboard-card__link--spotify"
											href={artistUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											View on Spotify
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

export default FollowedArtistsPage;
