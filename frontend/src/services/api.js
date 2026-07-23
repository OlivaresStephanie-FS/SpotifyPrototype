import axios from "axios";

// Empty baseURL uses the Vite origin so /auth requests can be proxied in Docker.
// withCredentials sends the HTTP-only session cookie for user-specific auth.
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
