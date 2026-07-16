function AuthLoadingState() { // Component to display a loading state while checking authentication status
	return (
		<div className="auth-status" role="status" aria-live="polite">
			<p className="auth-status__message">Checking authentication…</p>
		</div>
	);
}

export default AuthLoadingState;
