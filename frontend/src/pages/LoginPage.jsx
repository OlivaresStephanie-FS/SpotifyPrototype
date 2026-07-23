import { useEffect, useState } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLoadingState from "../components/AuthLoadingState";
import "../styles/login.css";

function getBackendLoginUrl() { // Function to construct the backend login URL for Spotify authorization
	const backendOrigin =
		import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:3000";

	return `${backendOrigin.replace(/\/$/, "")}/login`;
}

function getCallbackErrorMessage(errorCode) { // Function to map error codes to user-friendly messages
	switch (errorCode) {
		case "access_denied":
			return "Spotify authorization was cancelled. You can try again when ready.";
		case "authorization_failed":
			return "Spotify authorization could not be completed. Please try again.";
		case "missing_code":
			return "Authorization could not be completed. Please try again.";
		case "exchange_failed":
			return "Spotify authorization could not be completed. Please try again.";
		case "server_error":
			return "Something went wrong during sign-in. Please try again.";
		default:
			return errorCode
				? "A sign-in error occurred. Please try again."
				: null;
	}
}

function LoginPage() { // Component that handles the login page and Spotify authorization flow
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [redirectError, setRedirectError] = useState(null);
	const [callbackErrorMessage] = useState(() =>
		getCallbackErrorMessage(searchParams.get("error")),
	);

	useEffect(() => { // Effect to clear the error query parameter from the URL after handling it
		if (searchParams.get("error")) {
			setSearchParams({}, { replace: true });
		}
	}, [searchParams, setSearchParams]);

	if (isLoading) {
		return <AuthLoadingState />;
	}

	if (isAuthenticated) {
		const destination = location.state?.from?.pathname || "/";

		return <Navigate to={destination} replace />;
	}

	const handleConnect = () => { // Function to initiate the Spotify authorization flow
		setRedirectError(null);
		setIsRedirecting(true);

		try {
			const loginUrl = getBackendLoginUrl();

			if (!loginUrl.startsWith("http://") && !loginUrl.startsWith("https://")) {
				throw new Error("Invalid login URL.");
			}

			window.location.assign(loginUrl);
		} catch {
			setIsRedirecting(false);
			setRedirectError(
				"Unable to start Spotify authorization. Please try again.",
			);
		}
	};

	const displayError = redirectError || callbackErrorMessage;

	return (
		<section className="login-page" aria-labelledby="login-heading">
			<div className="login-card">
				<p className="login-card__brand">Soli Music Search</p>
				<h1 id="login-heading" className="login-card__title">
					Connect your Spotify account
				</h1>
				<p className="login-card__description">
					Sign in with Spotify to access your profile, followed artists, liked
					songs, and Spotify search in one personalized dashboard.
				</p>

				{displayError ? (
					<p className="login-card__error" role="alert">
						{displayError}
					</p>
				) : null}

				<button
					type="button"
					className="login-button"
					onClick={handleConnect}
					disabled={isRedirecting}
					aria-busy={isRedirecting}
				>
					{isRedirecting ? "Redirecting to Spotify…" : "Sign in with Spotify"}
				</button>

				<p className="login-card__privacy">
					Spotify securely handles your login credentials. This application
					never receives or stores your Spotify password. Spotify access and
					refresh tokens are securely stored on the server to maintain your
					authenticated session and communicate with the Spotify Web API on
					your behalf.
				</p>
			</div>
		</section>
	);
}

export default LoginPage;
