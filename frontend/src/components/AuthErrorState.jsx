function getBackendReconnectUrl() {
	const backendOrigin =
		import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:3000";

	return `${backendOrigin.replace(/\/$/, "")}/reauthorize`;
}

function requiresSpotifyReconnect(message) {
	return (
		typeof message === "string" &&
		message.toLowerCase().includes("new oauth scope")
	);
}

function AuthErrorState({
	message = "Unable to verify authentication status. Please try again.",
	onRetry,
}) {
	const showReconnect = requiresSpotifyReconnect(message);

	return (
		<div className="auth-status auth-status--error" role="alert">
			<span className="auth-status__icon" aria-hidden="true">
				!
			</span>
			<p className="auth-status__message">{message}</p>
			{showReconnect ? (
				<button
					type="button"
					className="auth-status__button"
					onClick={() => {
						window.location.assign(getBackendReconnectUrl());
					}}
				>
					Reconnect Spotify
				</button>
			) : typeof onRetry === "function" ? (
				<button
					type="button"
					className="auth-status__button"
					onClick={onRetry}
				>
					Retry
				</button>
			) : null}
		</div>
	);
}

export default AuthErrorState;
