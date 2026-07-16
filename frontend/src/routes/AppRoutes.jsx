import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import TopArtistsPage from "../pages/TopArtistsPage";
import TopTracksPage from "../pages/TopTracksPage";

function AppRoutes() { // Component that defines the application's routes and their corresponding components
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/top-artists" element={<TopArtistsPage />} />
					<Route path="/top-tracks" element={<TopTracksPage />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default AppRoutes;
