import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLoadingState from "./AuthLoadingState";
import AuthErrorState from "./AuthErrorState";

function ProtectedRoute() { // Component to protect routes that require authentication
	const { isAuthenticated, isLoading, error, refreshAuthentication } =
		useAuth();
	const location = useLocation();

	if (isLoading) {
		return <AuthLoadingState />;
	}

	if (error) {
		return <AuthErrorState onRetry={refreshAuthentication} />;
	}

	if (!isAuthenticated) {
		return (
			<Navigate to="/login" replace state={{ from: location }} />
		);
	}

	return <Outlet />;
}

export default ProtectedRoute;
