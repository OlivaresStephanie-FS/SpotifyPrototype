import { useState } from "react";
import AuthLoadingState from "../components/AuthLoadingState";
import AuthErrorState from "../components/AuthErrorState";
import {
	getDashboardErrorMessage,
	searchSpotify,
} from "../services/spotifyService";
import "../styles/dashboard.css";

const SEARCH_TYPES = [
	{ value: "artist", label: "Artist" },
	{ value: "album", label: "Album" },
	{ value: "track", label: "Track" },
];

function SearchPage() {
	const [query, setQuery] = useState("");
	const [type, setType] = useState("artist");
	const [results, setResults] = useState([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const trimmedQuery = query.trim();

		if (!trimmedQuery) {
			setHasSearched(true);
			setResults([]);
			setError(null);
			return;
		}

		setIsLoading(true);
		setError(null);
		setHasSearched(true);

		try {
			const data = await searchSpotify(trimmedQuery, type);
			setResults(Array.isArray(data?.results) ? data.results : []);
		} catch (err) {
			setResults([]);
			setError(getDashboardErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	};

	const showNoResults = !isLoading && !error && results.length === 0;

	return (
		<section className="dashboard-page" aria-labelledby="search-heading">
			<h1 id="search-heading" className="dashboard-page__title">
				Search
			</h1>

			<form className="search-form" onSubmit={handleSubmit}>
				<label className="search-form__field" htmlFor="search-query">
					<span className="search-form__label">Search</span>
					<input
						id="search-query"
						className="search-form__input"
						type="search"
						name="q"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search artists, albums, or tracks"
						autoComplete="off"
					/>
				</label>

				<label className="search-form__field" htmlFor="search-type">
					<span className="search-form__label">Search Type</span>
					<select
						id="search-type"
						className="search-form__select"
						name="type"
						value={type}
						onChange={(event) => setType(event.target.value)}
					>
						{SEARCH_TYPES.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</label>

				<button
					type="submit"
					className="search-form__button"
					disabled={isLoading}
					aria-busy={isLoading}
				>
					{isLoading ? "Searching…" : "Search"}
				</button>
			</form>

			{isLoading ? (
				<AuthLoadingState message="Searching Spotify…" />
			) : null}

			{error ? (
				<AuthErrorState
					message={error}
					onRetry={() => {
						setError(null);
						setHasSearched(false);
						setResults([]);
					}}
				/>
			) : null}

			{showNoResults ? (
				<p className="dashboard-empty" role="status">
					{hasSearched
						? "No results found for your search."
						: "No results yet. Enter a query to search Spotify."}
				</p>
			) : null}

			{!isLoading && !error && results.length > 0 ? (
				<ul className="dashboard-list">
					{results.map((item) => {
						const spotifyUrl = item.external_urls?.spotify;
						const isArtist = item.type === "artist";

						return (
							<li key={`${item.type}-${item.id}`} className="dashboard-card">
								{item.image && spotifyUrl ? (
									<a
										href={spotifyUrl}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`Open ${item.name} on Spotify`}
									>
										<img
											className={`dashboard-card__image${
												isArtist
													? " dashboard-card__image--round"
													: ""
											}`}
											src={item.image}
											alt=""
										/>
									</a>
								) : item.image ? (
									<img
										className={`dashboard-card__image${
											isArtist
												? " dashboard-card__image--round"
												: ""
										}`}
										src={item.image}
										alt=""
									/>
								) : spotifyUrl ? (
									<a
										className="dashboard-card__image dashboard-card__image--placeholder"
										href={spotifyUrl}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`Open ${item.name} on Spotify`}
									/>
								) : (
									<div
										className="dashboard-card__image dashboard-card__image--placeholder"
										aria-hidden="true"
									/>
								)}

								<div className="dashboard-card__content">
									<h2 className="dashboard-card__title">{item.name}</h2>
									{item.subtitle ? (
										<p className="dashboard-card__meta">{item.subtitle}</p>
									) : null}
									<p className="dashboard-card__meta">
										{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
									</p>
									{spotifyUrl ? (
										<a
											className="dashboard-card__link dashboard-card__link--spotify"
											href={spotifyUrl}
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
			) : null}
		</section>
	);
}

export default SearchPage;
