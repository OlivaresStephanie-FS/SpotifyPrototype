function AuthErrorState({ // Component that displays an error state when authentication fails or encounters an issue
	message = "Unable to verify authentication status. Please try again.",
	onRetry,
}) {
	return (
		<div className="auth-status auth-status--error" role="alert">
			<span className="auth-status__icon" aria-hidden="true">
				!
			</span>
			<p className="auth-status__message">{message}</p>
			{typeof onRetry === "function" ? (
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
