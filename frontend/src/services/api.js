import axios from "axios";

// Empty baseURL uses the Vite origin so /auth requests can be proxied in Docker.
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "",
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
