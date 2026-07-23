import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import solinycLogo from "../assets/solinyc-logo-512.png";

const navigationItems = [
	{ to: "/search", label: "Search" },
	{ to: "/profile", label: "Profile" },
	{ to: "/followed-artists", label: "Followed Artists" },
	{ to: "/saved-tracks", label: "Liked Songs" },
];

function AppHeader() {
	const { isAuthenticated, logout } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [logoutError, setLogoutError] = useState(null);
	const showNavigation = isAuthenticated && location.pathname !== "/login";

	const handleLogout = async () => {
		setLogoutError(null);
		setIsLoggingOut(true);

		try {
			await logout();
			navigate("/login", { replace: true });
		} catch {
			setLogoutError("Unable to log out. Please try again.");
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<header className="app-header">
			<div className="container app-header__inner">
				<NavLink className="app-brand" to="/" aria-label="Soli Music Search home">
					<img
						className="app-brand__mark"
						src={solinycLogo}
						alt=""
						aria-hidden="true"
					/>
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
						<button
							type="button"
							className="app-nav__link app-nav__link--action"
							onClick={handleLogout}
							disabled={isLoggingOut}
							aria-busy={isLoggingOut}
						>
							{isLoggingOut ? "Logging out…" : "Log Out"}
						</button>
					</nav>
				) : null}
			</div>

			{logoutError ? (
				<p className="app-header__error container" role="alert">
					{logoutError}
				</p>
			) : null}
		</header>
	);
}

export default AppHeader;
