import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy backend routes through the Vite dev server so the browser avoids CORS
// without modifying the completed Week 3 backend.

/**
 * DEVELOPMENT ONLY
 *
 * This proxy exists only for local Docker development to avoid
 * browser CORS issues while the backend does not expose CORS.
 *
 * Production deployments should communicate with the backend
 * through its public API and should not rely on this proxy.
 */

const apiProxyTarget =
	process.env.API_PROXY_TARGET || "http://localhost:3000";

export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5173,
		proxy: {
			"/auth": {
				target: apiProxyTarget,
				changeOrigin: true,
			},
		},
	},
});
