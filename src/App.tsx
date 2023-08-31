import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoadMaps } from "./components/RoadMaps";
import { RoadMap } from "./components/RoadMap";
import { context, context_value } from "freeflow-react/dist/index";
import { useContext, useEffect } from "react";
import { NewRoadMap } from "./components/NewRoadMap";
function App() {
	var freeflow_context = useContext(context);
	useEffect(() => {
		freeflow_context.set_state((prev) => ({
			...prev,
			profiles_seed: [{ user_id: 0, max_depth: undefined, is_active: true, jwt: undefined }],
		}));
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={<RoadMaps />}
					path="/"
				/>
				<Route
					element={<RoadMaps />}
					path="/roadmaps"
				/>
				<Route
					element={<RoadMap />}
					path="/roadmaps/:roadmap_id"
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
