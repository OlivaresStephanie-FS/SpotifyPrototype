/**
 * Resolves the backend origin for full-page OAuth navigation (/login, /reauthorize).
 *
 * Production builds (Vite PROD): use VITE_API_BASE_URL only, with a soli.nyc
 * fallback, so login and API share one host and a stale VITE_BACKEND_ORIGIN
 * (e.g. old Render URL) cannot be baked into the Netlify bundle.
 *
 * Local Docker (dev): VITE_API_BASE_URL is empty for the Vite proxy; OAuth still
 * needs an absolute backend origin because /login is not proxied — use
 * VITE_BACKEND_ORIGIN or http://localhost:3000.
 */
export function getBackendOrigin() {
	if (import.meta.env.PROD) {
		const apiBase = String(import.meta.env.VITE_API_BASE_URL || "")
			.trim()
			.replace(/\/$/, "");
		return apiBase || "https://api.soli.nyc";
	}

	const backendOrigin = String(import.meta.env.VITE_BACKEND_ORIGIN || "")
		.trim()
		.replace(/\/$/, "");
	return backendOrigin || "http://localhost:3000";
}
