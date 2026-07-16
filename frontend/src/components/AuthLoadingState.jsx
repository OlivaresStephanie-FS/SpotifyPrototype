function AuthLoadingState({ message = "Checking authentication…" }) { // Component that displays a loading state while checking authentication status
	return (
		<div className="auth-status" role="status" aria-live="polite">
			<span className="auth-status__indicator" aria-hidden="true" />
			<p className="auth-status__message">{message}</p>
		</div>
	);
}

export default AuthLoadingState;
