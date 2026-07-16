function AppFooter() {
	return (
		<footer className="app-footer">
			<div className="container app-footer__inner">
				<div className="app-footer__identity">
					<p className="app-footer__brand">
						© {new Date().getFullYear()} SOLINYC LLC • Soli Music Search
					</p>
				</div>
				<p className="app-footer__attribution">
					Built with React, Express, MongoDB, Docker, and the Spotify Web
					API.
				</p>
			</div>
		</footer>
	);
}

export default AppFooter;
