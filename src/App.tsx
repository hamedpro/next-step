import { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./App.css";
import { api_context } from "./api_context";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoadMaps } from "./components/RoadMaps";
import { RoadMap } from "./components/RoadMap";
function App() {
	return (
		<BrowserRouter>
			<api_context.Provider
				value={{ custom_axios: axios.create({ baseURL: "VITE_API_ENDPOINT" }) }}
			>
				<Routes>
					<Route element={<RoadMaps />} path="/" />
					<Route element={<RoadMaps />} path="/roadmaps" />
					<Route element={<RoadMap />} path="/roadmaps/:roadmap_id" />
				</Routes>
			</api_context.Provider>
		</BrowserRouter>
	);
}

export default App;
