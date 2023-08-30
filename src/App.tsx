import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoadMaps } from "./components/RoadMaps";
import { RoadMap } from "./components/RoadMap";
import { FreeFlowReact } from "freeflow-react";
import React from "react";
import { NewRoadMap } from "./components/NewRoadMap";
function App() {
	return (
		<FreeFlowReact>
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
		</FreeFlowReact>
	);
}

export default App;
