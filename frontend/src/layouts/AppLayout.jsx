import { Outlet } from "react-router-dom";

function AppLayout() {
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
