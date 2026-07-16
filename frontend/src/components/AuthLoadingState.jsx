function AuthLoadingState({ message = "Checking authentication…" }) { // Component to display a loading state while checking authentication
	return (
		<div className="auth-status" role="status" aria-live="polite">
			<p className="auth-status__message">{message}</p>
		</div>
	);
}

export default AuthLoadingState;
