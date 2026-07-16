import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import FollowedArtistsPage from "../pages/FollowedArtistsPage";
import SavedTracksPage from "../pages/SavedTracksPage";

function AppRoutes() { // Component that defines the application's routes and their corresponding components
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/profile" element={<ProfilePage />} />
					<Route
						path="/followed-artists"
						element={<FollowedArtistsPage />}
					/>
					<Route path="/saved-tracks" element={<SavedTracksPage />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default AppRoutes;
