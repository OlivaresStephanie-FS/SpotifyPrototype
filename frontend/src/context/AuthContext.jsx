import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { getAuthenticationStatus, logoutAuthentication } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) { // Provider component that manages authentication state and provides it to the rest of the application
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const refreshAuthentication = useCallback(async () => { // Function to refresh the authentication status by calling the backend service
		if (!isMountedRef.current) {
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const status = await getAuthenticationStatus();

			if (!isMountedRef.current) {
				return;
			}

			setIsAuthenticated(status.authenticated);
		} catch {
			if (!isMountedRef.current) {
				return;
			}

			setIsAuthenticated(false);
			setError(
				"Unable to verify authentication status. Please try again.",
			);
		} finally {
			if (isMountedRef.current) {
				setIsLoading(false);
			}
		}
	}, []);

	const logout = useCallback(async () => {
		await logoutAuthentication();

		if (!isMountedRef.current) {
			return;
		}

		setIsAuthenticated(false);
		setError(null);
	}, []);

	useEffect(() => {
		refreshAuthentication();
	}, [refreshAuthentication]);

	const value = useMemo( // Memoized value to prevent unnecessary re-renders of context consumers
		() => ({
			isAuthenticated,
			isLoading,
			error,
			refreshAuthentication,
			logout,
		}),
		[isAuthenticated, isLoading, error, refreshAuthentication, logout],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() { // Hook to consume the authentication context
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider.");
	}

	return context;
}
