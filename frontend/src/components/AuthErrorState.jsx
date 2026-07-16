function AuthErrorState({ // Component to display an error state when authentication fails
	message = "Unable to verify authentication status. Please try again.",
	onRetry,
}) {
	return (
		<div className="auth-status" role="alert">
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
