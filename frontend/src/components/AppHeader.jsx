import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigationItems = [
	{ to: "/profile", label: "Profile" },
	{ to: "/followed-artists", label: "Followed Artists" },
	{ to: "/saved-tracks", label: "Liked Songs" },
];

function AppHeader() {
	const { isAuthenticated } = useAuth();
	const location = useLocation();
	const showNavigation = isAuthenticated && location.pathname !== "/login";

	return (
		<header className="app-header">
			<div className="container app-header__inner">
				<NavLink className="app-brand" to="/" aria-label="Soli Music Search home">
					<span className="app-brand__mark" aria-hidden="true">
						♪
					</span>
					<span>Soli Music Search</span>
				</NavLink>

				{showNavigation ? (
					<nav className="app-nav" aria-label="Primary navigation">
						{navigationItems.map(({ to, label }) => (
							<NavLink
								key={to}
								to={to}
								className={({ isActive }) =>
									`app-nav__link${isActive ? " app-nav__link--active" : ""}`
								}
							>
								{label}
							</NavLink>
						))}
					</nav>
				) : null}
			</div>
		</header>
	);
}

export default AppHeader;
