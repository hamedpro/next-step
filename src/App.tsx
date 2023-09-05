import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./tailwind_output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoadMaps } from "./components/RoadMaps";
import { context } from "freeflow-react";
import { useContext, useEffect } from "react";
import { NewRoadMap } from "./components/NewRoadMap";
import { Root } from "./components/Root";
import { ThingRoute } from "./components/ThingRoute";
function App() {
	var freeflow_context = useContext(context);
	useEffect(() => {
		freeflow_context.set_state((prev) => ({
			...prev,
			profiles_seed: [
				{ user_id: 0, max_depth: undefined, is_active: false, jwt: undefined },
				{
					user_id: -1,
					jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjotMSwiZXhwIjoxNjk0Mjc2MzkxLCJpYXQiOjE2OTM2NzE1OTB9.zpH0ONCZb47fZd7jXwGlYZ7KeswQ7vGqvc11Is28oH0",
					is_active: true,
				},
			],
		}));
	}, []);
	/* useEffect(() => {
		console.log(freeflow_context.profiles_seed);
	}, [JSON.stringify(freeflow_context.profiles_seed)]); */

	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={<Root />}
					path="/"
				/>
				<Route
					element={<RoadMaps />}
					path="/roadmaps"
				/>
				<Route
					element={<ThingRoute />}
					path="/:thing_id"
				/>

				<Route
					element={<NewRoadMap />}
					path="/roadmaps/new"
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
