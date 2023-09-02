import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./tailwind_output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoadMaps } from "./components/RoadMaps";
import { RoadMap } from "./components/RoadMap";
import { context } from "freeflow-react";
import { useContext, useEffect } from "react";
import { ImportRoadMap } from "./components/ImportRoadMap";
import { NewRoadMap } from "./components/NewRoadMap";
import { EditRoadMap } from "./components/EditRoadMap";
import { RoadMapIndex } from "./components/RoadMapIndex";
function App() {
	var freeflow_context = useContext(context);
	useEffect(() => {
		freeflow_context.set_state((prev) => ({
			...prev,
			profiles_seed: [{ user_id: 0, max_depth: undefined, is_active: true, jwt: undefined }],
		}));
	}, []);
	/* useEffect(() => {
		console.log(freeflow_context.cache);
	}, [JSON.stringify(freeflow_context.cache)]); */

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
					element={<RoadMapIndex />}
					path="/roadmaps/:roadmap_id/*"
				/>
				<Route
					element={<ImportRoadMap />}
					path="/roadmaps/import"
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
