import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoadMaps } from "./components/RoadMaps";
import { RoadMap } from "./components/RoadMap";
import { FreeFlowReact } from "freeflow-react";
import React from "react";
function App() {
	return (
		<FreeFlowReact>
			<BrowserRouter>
				<Routes>
					<Route element={<RoadMaps />} path="/" />
					<Route element={<RoadMaps />} path="/roadmaps" />
					<Route element={<RoadMap />} path="/roadmaps/:roadmap_id" />
				</Routes>
			</BrowserRouter>
		</FreeFlowReact>
	);
}

export default App;
