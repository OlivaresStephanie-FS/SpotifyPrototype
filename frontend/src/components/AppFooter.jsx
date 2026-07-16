function AppFooter() {
	return (
		<footer className="app-footer">
			<div className="container app-footer__inner">
				<p className="app-footer__brand">
					Soli Music Search · {new Date().getFullYear()}
				</p>
				<p className="app-footer__attribution">
					Built with React, Express, MongoDB, Docker, and the Spotify Web
					API.
				</p>
			</div>
		</footer>
	);
}

export default AppFooter;
