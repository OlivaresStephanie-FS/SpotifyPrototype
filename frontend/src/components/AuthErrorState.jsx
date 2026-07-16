function AuthErrorState({ onRetry }) {
	return (
		<div className="auth-status" role="alert">
			<p className="auth-status__message">
				Unable to verify authentication status. Please try again.
			</p>
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
