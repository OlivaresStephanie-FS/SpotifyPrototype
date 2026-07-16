import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

function HomePage() { // Component that serves as the landing page of the application, providing an overview and navigation links based on authentication status
	const { isAuthenticated } = useAuth();

	return (
		<section className="home-page" aria-labelledby="home-heading">
			<div className="home-page__content">
				<p className="home-page__eyebrow">Your listening, personalized</p>
				<h1 id="home-heading" className="home-page__title">
					Soli Music Search
				</h1>
				<p className="home-page__description">
					Explore your Spotify profile, followed artists, and saved tracks in
					one focused experience.
				</p>

				{isAuthenticated ? (
					<div className="home-page__links" aria-label="Dashboard pages">
						<Link className="home-page__link" to="/profile">
							View Profile
						</Link>
						<Link className="home-page__link" to="/followed-artists">
							Followed Artists
						</Link>
						<Link className="home-page__link" to="/saved-tracks">
							Saved Tracks
						</Link>
					</div>
				) : null}
			</div>
		</section>
	);
}

export default HomePage;
