import { Outlet } from "react-router-dom";

function AppLayout() { // Main layout component that wraps the application and renders the current route's component
	return (
		<div className="app-layout">
			<main className="app-layout__main">
				<div className="container">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

export default AppLayout;
