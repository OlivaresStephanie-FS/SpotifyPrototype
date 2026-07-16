import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import "../styles/layout.css";

function AppLayout() { // Component that defines the overall layout of the application, including header, footer, and main content area where nested routes will be rendered
	return (
		<div className="app-layout">
			<AppHeader />
			<main className="app-layout__main">
				<div className="container">
					<Outlet />
				</div>
			</main>
			<AppFooter />
		</div>
	);
}

export default AppLayout;
